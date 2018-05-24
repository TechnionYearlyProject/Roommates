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
 * @param: container - the name of the container we want to fetch the image from
 * @param: path - the path inside the container to fetch the image from
 * @param: images - list of String which represent the images names we want to fetch
 * returns a list of image URLs
 */
const getImages = (container, path, images) => {
  const imageBaseURL = blobService.getUrl(SA.CONTAINERS[container]);
  const imagesList = images.map(image => `${imageBaseURL}/${path}/${image}`);
  return imagesList;
};

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
        (error, response) => {
          if (error) {
            reject(errors.imageUploadFailure);
          } else {
            console.log(response);
            imagesList.push(image);
            resolve();
          }
        });
    }));
  }
  console.log(imagesList);
  return Promise.all(promises)
    .then(() => imagesList);
};


module.exports = {
  getImages,
  uploadImages
};