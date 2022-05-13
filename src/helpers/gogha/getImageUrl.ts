import { UUID } from '../../domains/common';
import { ImageType, ImageSize } from './types';

/* eslint-disable import/prefer-default-export */
const { VUE_APP_GOGHA_API_ADDRESS: baseUrl = 'http://localhost:3000/' } = process.env;

interface GetImageUrlProps {
  uuid: UUID;
  type: ImageType;
  name: string;
  size?: ImageSize | null;
}

function getImageUrl({
  uuid, type, name, size,
}: GetImageUrlProps) {
  let url = `${baseUrl}${type}/${uuid}/${name}`;

  if (size) url += `/${size}`;

  return url;
}

export { getImageUrl };
