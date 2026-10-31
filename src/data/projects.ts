import type { Project } from '../types/portfolio';

// Pictures:  public/images/projects/    Videos:  public/videos/projects/
//   image:  picture on the 3D card
//   images: pictures shown as thumbnails in the popup (optional)
//   video:  trailer, plays first in the popup (optional)
const img = (file: string) => '/images/projects/' + encodeURIComponent(file);
const vid = (file: string) => '/videos/projects/' + encodeURIComponent(file);

export const projects: Project[] = [
{
  id: 'pres-ngeang',
  title: 'Chamnong Sne Preah Ngneang',
  role: 'Director of Photography',
  description: 'Still from Chamnong Sne Preah Ngneang.',
  image: img('pres_ngeang.JPG'),
  video: vid('pres-ngeang-trailer.MP4'), 
  images: Array.from({ length: 4 }, (_, i) => img(`pres-ngeang-image-${i + 1}.PNG`)),       // add more pictures here when you have them
},
{
  id: 'neang-phoung',
  title: 'Neang Phoung',
  role: 'Director of Photography',

  description: 'Still from Neang Phoung.',
  image: img('neangphoung.JPG'),
  video: vid('neang-phoung-trailer.MP4'),
  images: Array.from({ length: 4 }, (_, i) => img(`neang-phoung-image-${i + 1}.PNG`)),       // add more pictures here when you have them
},
{
  id: 'komherng',
  title: 'The Witch Return',
  role: 'Director of Photography',
  description: 'Still from Komherng.',   // must match the file name in public/videos/projects
  image: img('komherng.PNG'),
  video: vid('komherng_trailer.MP4'),
},
{
  id: 'kakei',
  title: 'Nitean Sne Kakei',
  role: 'Director of Photography',
  description: 'Still from Kakei.',
  image: img('kakei.JPG'),
  video: vid('kakei-trailer.MP4'),
  images: Array.from({ length: 4 }, (_, i) => img(`kakei-image-${i + 1}.PNG`)),       // add more pictures here when you have them
},
{
  id: 'dont-leave',
  title: 'Lost You Forever',
  role: 'Director of Photography',
  description: 'Still from Don’t Leave.',
  image: img("don't_leave.JPG"),
  video: vid('dont-leave-trailer.MP4'),   // must match the file name in public/videos/projects
  images: Array.from({ length: 4 }, (_, i) => img(`dont-leave-image-${i + 1}.PNG`)),       // add more pictures here when you have them
},
{
  id: 'dont-promise',
  title: 'Don’t Promise',
  role: 'Director of Photography',
  description: 'Still from Don’t Promise.',
  image: img("don't promise.JPG"),
  video: vid('dont_promise_trailer.mp4'),   // must match the file name in public/videos/projects
  images: Array.from({ length: 4 }, (_, i) => img(`promise-image-${i + 1}.PNG`)),       // add more pictures here when you have them
}];