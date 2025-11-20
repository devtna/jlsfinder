
import { School, CourseType, Schedule } from '../types';

export const mockSchools: School[] = [
  {
    id: '1',
    name: 'Genki Japanese and Culture School',
    address: '1-2-3 Shinjuku, Shinjuku-ku, Tokyo',
    city: 'Tokyo',
    phone: ['03-1234-5678'],
    googleMapsUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3818.9741869036457!2d96.12721667411053!3d16.827636618691127!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30c195ddf90f8cf7%3A0xbae192d3203eb7cd!2sUVS%20Japanese%20Language%20Center!5e0!3m2!1sen!2ske!4v1763637064210!5m2!1sen!2ske',
    lat: 35.6938,
    lng: 139.7034,
    schedule: [Schedule.Morning, Schedule.Afternoon],
    courseTypes: [CourseType.JLPT_N5, CourseType.JLPT_N4],
    tokuteiCourses: [],
    images: ['https://picsum.photos/seed/genki/800/600', 'https://picsum.photos/seed/genki2/800/600'],
    description: 'A friendly and effective school located in the heart of Shinjuku. We focus on practical communication skills and cultural immersion.'
  },
  {
    id: '2',
    name: 'KAI Japanese Language School',
    address: '4-5-6 Shibuya, Shibuya-ku, Tokyo',
    city: 'Tokyo',
    phone: ['03-9876-5432'],
    googleMapsUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3241.281829672288!2d139.6994513152582!3d35.65803408019688!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x60188b57b4f5b5b5%3A0x9b22e7dfb3b8955!2sKAI%20Japanese%20Language%20School!5e0!3m2!1sen!2sjp!4v1678886400001',
    lat: 35.6580,
    lng: 139.7016,
    schedule: [Schedule.Morning, Schedule.Afternoon, Schedule.Evening],
    courseTypes: [CourseType.JLPT_N3, CourseType.JLPT_N2, CourseType.JLPT_N1],
    tokuteiCourses: ['Tokutei Gaishoku'],
    images: ['https://picsum.photos/seed/kai/800/600', 'https://picsum.photos/seed/kai2/800/600'],
    description: 'Specializing in business Japanese and JLPT preparation, KAI offers a professional environment for serious learners in Shibuya.'
  },
  {
    id: '3',
    name: 'JaLS Group - Kyoto Campus',
    address: '7-8-9 Nakagyo-ku, Kyoto',
    city: 'Kyoto',
    phone: ['075-111-2222'],
    googleMapsUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3268.641549429188!2d135.7658403152399!3d35.01163628036128!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x600108920d9a310f%3A0x1c24a6b2f4bcf5d6!2sJaLS%20GROUP%20-%20Kyoto%20Japanese%20Language%20School!5e0!3m2!1sen!2sjp!4v1678886400002',
    lat: 35.0116,
    lng: 135.7681,
    schedule: [Schedule.Morning, Schedule.Afternoon],
    courseTypes: [CourseType.JLPT_N5],
    tokuteiCourses: [],
    images: ['https://picsum.photos/seed/jals/800/600'],
    description: 'Learn Japanese while experiencing the traditional culture of Kyoto. Our school offers many activities and a chance to make new friends.'
  },
  {
    id: '4',
    name: 'Osaka YMCA International School',
    address: '1-1-1 Naniwa-ku, Osaka',
    city: 'Osaka',
    phone: ['06-3333-4444'],
    googleMapsUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3281.258682977717!2d135.504067315231!3d34.66544218044158!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6000e74176840001%3A0x3c7a0c7b3b3b3b3b!2sOsaka%20YMCA%20International%20School!5e0!3m2!1sen!2sjp!4v1678886400003',
    lat: 34.6655,
    lng: 135.5040,
    schedule: [Schedule.FullDay],
    courseTypes: [CourseType.JLPT_N2],
    tokuteiCourses: ['Tokutei Hotel'],
    images: ['https://picsum.photos/seed/ymca/800/600'],
    description: 'A large, well-established school in Osaka providing comprehensive and intensive Japanese language programs for students aiming for higher education or employment.'
  },
  {
    id: '5',
    name: 'NILS Fukuoka',
    address: '2-2-2 Hakata-ku, Fukuoka',
    city: 'Fukuoka',
    phone: ['092-555-6666'],
    googleMapsUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3323.896758368538!2d130.4184223152018!3d33.59035508073578!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x354191c7a8b8b8b9%3A0x1b2b3b4b5b6b7b8b!2sNILS%20Fukuoka!5e0!3m2!1sen!2sjp!4v1678886400004',
    lat: 33.5904,
    lng: 130.4206,
    schedule: [Schedule.Morning, Schedule.Afternoon, Schedule.Evening],
    courseTypes: [CourseType.JLPT_N4, CourseType.JLPT_N3],
    tokuteiCourses: ['Tokutei Kaigo'],
    images: ['https://picsum.photos/seed/nils/800/600', 'https://picsum.photos/seed/nils2/800/600'],
    description: 'Study Japanese in the vibrant and friendly city of Fukuoka. NILS offers a wide range of courses to suit all levels and goals.'
  }
];