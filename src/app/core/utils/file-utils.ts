const MAX_FILE_SIZE_MB = 20;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

const ALLOWED_AUDIO_TYPES = [
  'audio/mpeg',
  'audio/wav',
  'audio/ogg',
  'audio/x-wav'
];

const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png'
]


export const validateAudioFile = (file: File): string | null => {
  if(file.size > MAX_FILE_SIZE_BYTES) {
    return `le fichier dépasse la taille maximal de ${MAX_FILE_SIZE_MB}MB`;
  }

  if(!ALLOWED_AUDIO_TYPES.includes(file.type)) {
    return `Format non supporté. Utilisez MP3, WAV ou OGG. (recu: ${file.type})`;
  }

  return null;
}


export const validateImageFile = (file: File): string | null =>  {

  if(file.size > MAX_FILE_SIZE_BYTES) {
    return `L'image est trop volumineuse (Max ${MAX_FILE_SIZE_MB}MB).`;
  }

  if(!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return `Format d'image invalide. Utilisez PNG ou JPEG.`;
  }

  return null;
}

export const getAudioDuration = (file: File): Promise<number> => {
  return new Promise((resolve, reject) => {
    const objectUrl  = URL.createObjectURL(file);
    const audio = new Audio(objectUrl);

    audio.addEventListener('loadedmetadata', () => {
      const duration = audio.duration;
      URL.revokeObjectURL(objectUrl);
      resolve(duration);
    });

    audio.addEventListener('error', () => {
      URL.revokeObjectURL(objectUrl);
      reject('Erreur lors de la lecture du fichier audio');
    });

  });
}

export const formatDuration = (seconds: number): string => {
  if(!seconds) return '0:00';

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;

}
