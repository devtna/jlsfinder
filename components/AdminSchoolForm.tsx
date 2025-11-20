
import React, { useState, useEffect } from 'react';
import { School, CourseType, Schedule } from '../types';
import { TrashIcon } from './icons';

interface AdminSchoolFormProps {
  onSave: (school: School | Omit<School, 'id'>) => void;
  onClose: () => void;
  initialData?: School | null;
}

const emptySchool: Omit<School, 'id' | 'tokuteiCourses' | 'lat' | 'lng'> & { tokuteiCourses: string[], lat: string, lng: string } = {
  name: '',
  address: '',
  city: '',
  phone: [''],
  googleMapsUrl: '',
  lat: '',
  lng: '',
  schedule: [],
  courseTypes: [],
  tokuteiCourses: [],
  images: [''],
  description: ''
};

const inputBaseClasses = "block w-full border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-brand-red focus:border-brand-red dark:bg-slate-700 dark:border-slate-600 dark:text-white transition";
const fieldsetClasses = "space-y-4 bg-slate-50 dark:bg-slate-800/50 p-5 rounded-lg border border-slate-200 dark:border-slate-700";
const labelClasses = "block text-sm font-semibold text-slate-700 dark:text-slate-300";

// Helper function to resize and compress images
const resizeImage = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 600;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        // Compress to JPEG with 0.7 quality to save space in LocalStorage
        resolve(canvas.toDataURL('image/jpeg', 0.7));
      };
      img.onerror = (error) => reject(error);
    };
    reader.onerror = (error) => reject(error);
  });
};

const getInitialFormData = (data: School | null | undefined) => {
    if (!data) return emptySchool;
    return {
        ...data,
        phone: data.phone && data.phone.length > 0 ? data.phone : [''],
        tokuteiCourses: data.tokuteiCourses || [],
        images: data.images && data.images.length > 0 ? data.images : [''],
        description: data.description || '',
        lat: data.lat?.toString() || '',
        lng: data.lng?.toString() || ''
    };
};

const AdminSchoolForm: React.FC<AdminSchoolFormProps> = ({ onSave, onClose, initialData }) => {
  const [formData, setFormData] = useState(getInitialFormData(initialData));
  const [imageSourceType, setImageSourceType] = useState<'url' | 'upload'>('url');
  const [isProcessingImage, setIsProcessingImage] = useState(false);

  useEffect(() => {
    const initialFormState = getInitialFormData(initialData);
    setFormData(initialFormState);
    if (initialFormState.images?.[0]) {
      if (initialFormState.images[0].startsWith('data:')) {
        setImageSourceType('upload');
      } else {
        setImageSourceType('url');
      }
    } else {
      setImageSourceType('url');
    }
  }, [initialData]);

  // Auto-sync Latitude/Longitude from Google Maps URL
  useEffect(() => {
    const url = formData.googleMapsUrl;
    if (url) {
      // Regex for @lat,lng (Desktop maps)
      const matchAt = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
      // Regex for ?q=lat,lng or &ll=lat,lng (Embed/Query)
      const matchQ = url.match(/[?&](?:q|ll|center)=(-?\d+\.\d+),(-?\d+\.\d+)/);
      
      if (matchAt) {
         // Only update if currently empty or matching the old value to avoid overwriting manual changes unnecessarily
         if (!formData.lat || !formData.lng) {
             setFormData(prev => ({ ...prev, lat: matchAt[1], lng: matchAt[2] }));
         }
      } else if (matchQ) {
         if (!formData.lat || !formData.lng) {
             setFormData(prev => ({ ...prev, lat: matchQ[1], lng: matchQ[2] }));
         }
      }
    }
  }, [formData.googleMapsUrl]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleMultiCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'courseTypes' | 'schedule') => {
    const { value, checked } = e.target;
    setFormData(prev => {
        const currentValues = prev[field] as string[];
        if (checked) {
            return { ...prev, [field]: [...currentValues, value] };
        } else {
            return { ...prev, [field]: currentValues.filter(item => item !== value) };
        }
    });
  };

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        setIsProcessingImage(true);
        try {
            const resizedImage = await resizeImage(file);
            setFormData(prev => ({ ...prev, images: [resizedImage] }));
        } catch (error) {
            console.error("Error processing image:", error);
            alert("Failed to process image. Please try another file.");
        } finally {
            setIsProcessingImage(false);
        }
    }
  };

  const handleImageSourceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newType = e.target.value as 'url' | 'upload';
    if (newType !== imageSourceType) {
        setImageSourceType(newType);
        setFormData(prev => ({ ...prev, images: [''] }));
    }
  };

  const handleDynamicListChange = (e: React.ChangeEvent<HTMLInputElement>, index: number, field: 'phone' | 'tokuteiCourses') => {
    const newList = [...formData[field]];
    newList[index] = e.target.value;
    setFormData(prev => ({ ...prev, [field]: newList }));
  };

  const addDynamicListItem = (field: 'phone' | 'tokuteiCourses') => {
    setFormData(prev => ({ ...prev, [field]: [...prev[field], ''] }));
  };

  const removeDynamicListItem = (index: number, field: 'phone' | 'tokuteiCourses') => {
    setFormData(prev => ({ ...prev, [field]: prev[field].filter((_, i) => i !== index) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isProcessingImage) return;
    
    const { lat, lng, ...rest } = formData;

    const finalData = {
        ...rest,
        phone: formData.phone.filter(p => p.trim() !== ''),
        tokuteiCourses: formData.tokuteiCourses.filter(c => c.trim() !== ''),
        lat: lat ? parseFloat(lat) : undefined,
        lng: lng ? parseFloat(lng) : undefined
    };
    onSave(finalData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <fieldset className={fieldsetClasses}>
        <legend className="text-lg font-bold text-slate-800 dark:text-white mb-2">Basic Information</legend>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClasses}>School Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} className={`${inputBaseClasses} mt-1`} required />
          </div>
          <div>
              <label className={labelClasses}>City</label>
              <input type="text" name="city" value={formData.city} onChange={handleChange} className={`${inputBaseClasses} mt-1`} required />
          </div>
        </div>
        <div>
          <label className={labelClasses}>Address</label>
          <input type="text" name="address" value={formData.address} onChange={handleChange} className={`${inputBaseClasses} mt-1`} required />
        </div>
        <div>
          <label className={labelClasses}>Description</label>
          <textarea name="description" value={formData.description} onChange={handleChange} className={`${inputBaseClasses} mt-1`} rows={4}></textarea>
        </div>
      </fieldset>

      <fieldset className={fieldsetClasses}>
        <legend className="text-lg font-bold text-slate-800 dark:text-white mb-2">Contact & Location</legend>
        <div>
          <label className={labelClasses}>Phone Numbers</label>
          {formData.phone.map((p, index) => (
              <div key={index} className="flex items-center gap-2 mt-2">
                  <input type="tel" value={p} onChange={(e) => handleDynamicListChange(e, index, 'phone')} className={`${inputBaseClasses} flex-grow`} required={index === 0} />
                  {formData.phone.length > 1 && (
                      <button type="button" onClick={() => removeDynamicListItem(index, 'phone')} className="p-2 text-slate-500 hover:text-brand-red dark:text-slate-400 dark:hover:text-red-500 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700" aria-label="Remove phone number">
                          <TrashIcon className="h-5 w-5" />
                      </button>
                  )}
              </div>
          ))}
          <button type="button" onClick={() => addDynamicListItem('phone')} className="mt-2 text-sm font-semibold text-brand-red hover:underline">+ Add Phone Number</button>
        </div>
        
        <div>
          <label className={labelClasses}>Google Maps URL</label>
          <input type="url" name="googleMapsUrl" value={formData.googleMapsUrl} onChange={handleChange} className={`${inputBaseClasses} mt-1`} placeholder="https://www.google.com/maps/..." required />
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Paste a Google Maps link here. We'll try to auto-detect coordinates.</p>
        </div>

        <div className="grid grid-cols-2 gap-4 bg-slate-100 dark:bg-slate-700/50 p-3 rounded-lg border border-slate-200 dark:border-slate-600">
             <div>
                 <label className={`${labelClasses} text-xs uppercase`}>Latitude</label>
                 <input type="number" step="any" name="lat" value={formData.lat} onChange={handleChange} className={`${inputBaseClasses} mt-1 text-sm`} placeholder="35.6..." />
             </div>
             <div>
                 <label className={`${labelClasses} text-xs uppercase`}>Longitude</label>
                 <input type="number" step="any" name="lng" value={formData.lng} onChange={handleChange} className={`${inputBaseClasses} mt-1 text-sm`} placeholder="139.7..." />
             </div>
             <div className="col-span-2 text-xs text-slate-400">
                 Coordinates are used for the interactive map pin. Leave blank to rely on address search (less accurate).
             </div>
        </div>
      </fieldset>

      <fieldset className={fieldsetClasses}>
        <legend className="text-lg font-bold text-slate-800 dark:text-white mb-2">Images & Courses</legend>
        <div>
          <label className={labelClasses}>School Image</label>
          <div className="mt-2 flex items-center space-x-6 mb-4">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                  type="radio"
                  name="imageSourceType"
                  value="url"
                  checked={imageSourceType === 'url'}
                  onChange={handleImageSourceChange}
                  className="h-4 w-4 rounded-full border-slate-300 text-brand-red focus:ring-brand-red dark:bg-slate-600 dark:border-slate-500"
              />
              <span className="text-sm font-medium text-slate-800 dark:text-slate-300">From URL</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                  type="radio"
                  name="imageSourceType"
                  value="upload"
                  checked={imageSourceType === 'upload'}
                  onChange={handleImageSourceChange}
                  className="h-4 w-4 rounded-full border-slate-300 text-brand-red focus:ring-brand-red dark:bg-slate-600 dark:border-slate-500"
              />
              <span className="text-sm font-medium text-slate-800 dark:text-slate-300">Upload File</span>
            </label>
          </div>

          {imageSourceType === 'url' ? (
              <input type="url" name="images" value={formData.images[0] && !formData.images[0].startsWith('data:') ? formData.images[0] : ''} onChange={(e) => setFormData(prev => ({...prev, images: [e.target.value]}))} className={`${inputBaseClasses}`} placeholder="https://picsum.photos/seed/new/800/600" />
          ) : (
              <div>
                  <input type="file" accept="image/*" onChange={handleImageFileChange} className={`${inputBaseClasses} file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-brand-red hover:file:bg-red-100 dark:file:bg-red-900/50 dark:file:text-red-300 dark:hover:file:bg-red-900`} />
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Images are automatically compressed for performance.</p>
              </div>
          )}
          {isProcessingImage && <p className="text-sm text-slate-500 mt-2 animate-pulse">Processing image...</p>}
          {formData.images[0] && !isProcessingImage && <img src={formData.images[0]} alt="School preview" className="mt-4 rounded-lg h-32 w-auto object-cover shadow-sm" />}
        </div>
        <div>
          <label className={labelClasses}>Course Types (JLPT)</label>
          <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-3 text-slate-800 dark:text-slate-300">
            {Object.values(CourseType).map(type => (
                <label key={type} className="flex items-center space-x-2 p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700/50">
                    <input type="checkbox" value={type} checked={formData.courseTypes.includes(type)} onChange={e => handleMultiCheckboxChange(e, 'courseTypes')} className="h-4 w-4 rounded text-brand-red focus:ring-brand-red dark:bg-slate-600 dark:border-slate-500"/>
                    <span>{type}</span>
                </label>
            ))}
          </div>
        </div>
        <div>
          <label className={labelClasses}>Tokutei Courses (Custom)</label>
          {formData.tokuteiCourses.map((course, index) => (
              <div key={index} className="flex items-center gap-2 mt-2">
                  <input type="text" value={course} onChange={(e) => handleDynamicListChange(e, index, 'tokuteiCourses')} className={`${inputBaseClasses} flex-grow`} placeholder="e.g., Tokutei Kaigo" />
                  <button type="button" onClick={() => removeDynamicListItem(index, 'tokuteiCourses')} className="p-2 text-slate-500 hover:text-brand-red dark:text-slate-400 dark:hover:text-red-500 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700" aria-label="Remove Tokutei course">
                      <TrashIcon className="h-5 w-5" />
                  </button>
              </div>
          ))}
          <button type="button" onClick={() => addDynamicListItem('tokuteiCourses')} className="mt-2 text-sm font-semibold text-brand-red hover:underline">+ Add Tokutei Course</button>
        </div>
        <div>
          <label className={labelClasses}>Schedules</label>
          <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-3 text-slate-800 dark:text-slate-300">
            {Object.values(Schedule).map(time => (
                <label key={time} className="flex items-center space-x-2 p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700/50">
                    <input type="checkbox" value={time} checked={formData.schedule.includes(time)} onChange={e => handleMultiCheckboxChange(e, 'schedule')} className="h-4 w-4 rounded text-brand-red focus:ring-brand-red dark:bg-slate-600 dark:border-slate-500"/>
                    <span>{time}</span>
                </label>
            ))}
          </div>
        </div>
      </fieldset>

      <div className="flex justify-end gap-4 pt-4 border-t border-slate-200 dark:border-slate-700">
        <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg font-semibold bg-slate-200 text-slate-800 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600">
          Cancel
        </button>
        <button type="submit" disabled={isProcessingImage} className={`bg-brand-red text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors ${isProcessingImage ? 'opacity-50 cursor-not-allowed' : ''}`}>
          {isProcessingImage ? 'Processing...' : 'Save School'}
        </button>
      </div>
    </form>
  );
};

export default AdminSchoolForm;
