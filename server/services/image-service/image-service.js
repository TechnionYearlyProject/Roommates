/**
 * @author: Alon Talmor (based on Idan Yadgar code)
 * @date: 24/05/18
 *
 * This service is used to upload and fetch images to a remote server.
 */
const _ = require('lodash');
const azureStorage = require('azure-storage');
const uuid = require('uuid/v4');
const {
  AZURE
} = require('../../constants');
const errors = require('../../errors');

const SA = AZURE.STORAGE_ACCOUNT;
const blobService = azureStorage.createBlobService(SA.NAME, SA.ACCESS_KEY);

/**
 * @author: Alon Talmor
 * @date: 24/05/18
 *
 * @param: container - the name of the container we want to fetch the images from
 * @param: path - the path inside the container to fetch the images from
 * @param: images - list of String which represent the images names we want to fetch
 * @return: a list of image URLs.
 */
const getImages = (container, path, images) => {
  const imageBaseURL = blobService.getUrl(SA.CONTAINERS[container]);
  const imagesList = _.compact(images).map(image => `${imageBaseURL}/${path}/${image}`);
  return imagesList;
};

/**
 * @author: Alon Talmor
 * @date: 24/05/18
 *
 * @param: images - list of Base64 Strings to extract details from.
 * @return: a list of the image details as an Object of {type, buffer}
 *          type - the type of the image
 *          buffer - image base64 representation
 */
const getBase64Data = (images) => {
  const imagesData = [];
  for (let i = 0; i < images.length; i += 1) {
    const matches = images[i].imageURL.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
    const type = matches[1];
    const buffer = Buffer.from(matches[2], 'base64');
    imagesData.push({
      type,
      buffer
    });
  }
  return imagesData;
};

/**
 * @author: Alon Talmor
 * @date: 24/05/18
 *
 * @param: container - the name of the container we want to upload the images to
 * @param: path - the path inside the container to upload the images to
 * @param: images - list of Base64 Strings of the images we want to upload
 *
 * @return: a Promise which will contains a list of Strings which are the uploaded images names
 */
const uploadImages = (container, path, images) => {
  const promises = [];
  const imagesList = [];
  const imagesData = getBase64Data(_.castArray(images));
  for (let i = 0; i < imagesData.length; i += 1) {
    const image = `${uuid()}.${imagesData[i].type.split('/')[1]}`;
    promises.push(new Promise((resolve, reject) => {
      blobService.createBlockBlobFromText(
        SA.CONTAINERS[container],
        `${path}/${image}`,
        imagesData[i].buffer, {
          contentType: imagesData[i].type
        },
        (error) => {
          if (error) {
            reject(errors.imageUploadFailure);
          } else {
            imagesList.push(image);
            resolve();
          }
        });
    }));
  }
  return Promise.all(promises)
    .then(() => imagesList);
};


module.exports = {
  getImages,
  uploadImages
};