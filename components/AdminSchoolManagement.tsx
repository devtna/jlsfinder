
import React, { useState, useEffect } from 'react';
import { School } from '../types';
import { PencilIcon, TrashIcon, ChevronLeftIcon, ChevronRightIcon } from './icons';
import { useData } from '../context/DataContext';
import Modal from './Modal';
import AdminSchoolForm from './AdminSchoolForm';

const ITEMS_PER_PAGE = 10;

const AdminSchoolManagement: React.FC = () => {
  const { schools, addSchool, updateSchool, deleteSchool } = useData();
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingSchool, setEditingSchool] = useState<School | null>(null);
  const [schoolToDeleteId, setSchoolToDeleteId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const schoolToDelete = schools.find(s => s.id === schoolToDeleteId);

  // Pagination Calculation
  const totalPages = Math.ceil(schools.length / ITEMS_PER_PAGE);
  
  // Adjust current page if items are deleted and page becomes empty
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [schools.length, totalPages, currentPage]);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentSchools = schools.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleEdit = (school: School) => {
    setEditingSchool(school);
    setIsFormModalOpen(true);
  };

  const handleDeleteClick = (schoolId: string) => {
    setSchoolToDeleteId(schoolId);
  };
  
  const handleConfirmDelete = () => {
    if (schoolToDeleteId) {
        deleteSchool(schoolToDeleteId);
        setSchoolToDeleteId(null);
    }
  };

  const handleAddSchool = () => {
      setEditingSchool(null);
      setIsFormModalOpen(true);
  };
  
  const handleCloseFormModal = () => {
    setIsFormModalOpen(false);
    setEditingSchool(null);
  };

  const handleSaveSchool = (schoolData: School | Omit<School, 'id'>) => {
    if ('id' in schoolData) {
        updateSchool(schoolData);
    } else {
        addSchool(schoolData);
    }
    handleCloseFormModal();
  };

  return (
    <>
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg shadow-slate-200/50 dark:shadow-none border border-slate-200 dark:border-slate-700">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Manage Schools</h2>
          <button 
              onClick={handleAddSchool}
              className="bg-brand-red text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors self-start sm:self-auto"
          >
              Add New School
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-slate-700/50">
              <tr>
                <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Name</th>
                <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">City</th>
                <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Phone</th>
                <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {currentSchools.map(school => (
                <tr key={school.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="p-4 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">{school.name}</td>
                  <td className="p-4 text-slate-500 dark:text-slate-400 whitespace-nowrap">{school.city}</td>
                  <td className="p-4 text-slate-500 dark:text-slate-400 whitespace-nowrap">{school.phone.join(', ')}</td>
                  <td className="p-4">
                    <div className="flex gap-2 justify-end">
                      <button onClick={() => handleEdit(school)} className="p-2 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700" aria-label="Edit">
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button onClick={() => handleDeleteClick(school.id)} className="p-2 text-slate-500 dark:text-slate-400 hover:text-brand-red dark:hover:text-red-500 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700" aria-label="Delete">
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {schools.length === 0 && (
            <p className="text-center py-8 text-slate-500 dark:text-slate-400">No schools have been added yet.</p>
          )}
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-700 px-4 py-3 sm:px-0 mt-4 pt-4">
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-slate-700 dark:text-slate-300">
                  Showing <span className="font-medium">{startIndex + 1}</span> to <span className="font-medium">{Math.min(startIndex + ITEMS_PER_PAGE, schools.length)}</span> of <span className="font-medium">{schools.length}</span> results
                </p>
              </div>
              <div>
                <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center rounded-l-md px-2 py-2 text-slate-400 ring-1 ring-inset ring-slate-300 dark:ring-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                  >
                    <span className="sr-only">Previous</span>
                    <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                  </button>
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      aria-current={currentPage === i + 1 ? 'page' : undefined}
                      className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold focus:z-20 focus:outline-offset-0 ${
                        currentPage === i + 1
                          ? 'z-10 bg-brand-red text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red'
                          : 'text-slate-900 dark:text-slate-200 ring-1 ring-inset ring-slate-300 dark:ring-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center rounded-r-md px-2 py-2 text-slate-400 ring-1 ring-inset ring-slate-300 dark:ring-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                  >
                    <span className="sr-only">Next</span>
                    <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                  </button>
                </nav>
              </div>
            </div>
            
            {/* Mobile Pagination */}
            <div className="flex flex-1 justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-600 disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-sm text-slate-600 dark:text-slate-300 self-center">
                 Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="relative ml-3 inline-flex items-center rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-600 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      <Modal isOpen={isFormModalOpen} onClose={handleCloseFormModal} title={editingSchool ? 'Edit School' : 'Add New School'}>
        <AdminSchoolForm 
            onSave={handleSaveSchool}
            onClose={handleCloseFormModal}
            initialData={editingSchool}
        />
      </Modal>

      <Modal isOpen={!!schoolToDeleteId} onClose={() => setSchoolToDeleteId(null)} title="Confirm Deletion">
        {schoolToDelete && (
            <div>
                <p className="text-slate-600 dark:text-slate-300">Are you sure you want to delete the school "{schoolToDelete.name}"? This action cannot be undone.</p>
                <div className="flex justify-end gap-4 mt-6">
                    <button type="button" onClick={() => setSchoolToDeleteId(null)} className="px-4 py-2 rounded-lg font-semibold bg-slate-200 text-slate-800 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600">
                      Cancel
                    </button>
                    <button type="button" onClick={handleConfirmDelete} className="bg-brand-red text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700">
                      Delete
                    </button>
                </div>
            </div>
        )}
      </Modal>
    </>
  );
};

export default AdminSchoolManagement;
