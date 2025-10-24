const mongoose = require('mongoose');
const Grid = require('gridfs-stream');

let gfs;
let gridfsBucket;

// Initialize GridFS
const initGridFS = () => {
  const conn = mongoose.connection;
  
  if (conn.readyState === 1) {
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('pdfs');
    gridfsBucket = new mongoose.mongo.GridFSBucket(conn.db, {
      bucketName: 'pdfs'
    });
    console.log('GridFS initialized successfully');
  } else {
    conn.once('open', () => {
      gfs = Grid(conn.db, mongoose.mongo);
      gfs.collection('pdfs');
      gridfsBucket = new mongoose.mongo.GridFSBucket(conn.db, {
        bucketName: 'pdfs'
      });
      console.log('GridFS initialized successfully');
    });
  }
};

/**
 * Upload PDF to GridFS from Buffer
 * @param {Buffer} buffer - PDF file buffer
 * @param {String} filename - Original filename
 * @param {Object} metadata - Additional metadata (optional)
 * @returns {Promise<Object>} - Returns { fileId, filename, size }
 */
const uploadPDFToGridFS = (buffer, filename, metadata = {}) => {
  return new Promise((resolve, reject) => {
    if (!gridfsBucket) {
      return reject(new Error('GridFS not initialized'));
    }

    const uploadStream = gridfsBucket.openUploadStream(filename, {
      contentType: 'application/pdf',
      metadata: {
        ...metadata,
        uploadDate: new Date()
      }
    });

    uploadStream.on('finish', (file) => {
      resolve({
        fileId: uploadStream.id.toString(),
        filename: filename,
        size: buffer.length
      });
    });

    uploadStream.on('error', (error) => {
      reject(error);
    });

    // Write buffer to GridFS
    uploadStream.end(buffer);
  });
};

/**
 * Get PDF from GridFS as a readable stream
 * @param {String} fileId - GridFS file ID
 * @returns {Promise<Object>} - Returns { readStream, file }
 */
const getPDFFromGridFS = async (fileId) => {
  if (!gridfsBucket) {
    throw new Error('GridFS not initialized');
  }

  try {
    const _id = new mongoose.Types.ObjectId(fileId);
    
    // Find file metadata first
    const files = await gridfsBucket.find({ _id }).toArray();
    
    if (!files || files.length === 0) {
      throw new Error('File not found');
    }

    const file = files[0];

    // Create read stream
    const readStream = gridfsBucket.openDownloadStream(_id);

    return {
      readStream,
      file
    };
  } catch (error) {
    if (error.message === 'Invalid file ID') {
      throw error;
    }
    throw new Error('Invalid file ID');
  }
};

/**
 * Delete PDF from GridFS
 * @param {String} fileId - GridFS file ID
 * @returns {Promise<Boolean>}
 */
const deletePDFFromGridFS = async (fileId) => {
  if (!gridfsBucket) {
    throw new Error('GridFS not initialized');
  }

  try {
    const _id = new mongoose.Types.ObjectId(fileId);
    
    // Check if file exists first
    const files = await gridfsBucket.find({ _id }).toArray();
    
    if (!files || files.length === 0) {
      throw new Error('File not found in GridFS');
    }

    // Delete the file
    await gridfsBucket.delete(_id);
    return true;
  } catch (error) {
    if (error.message === 'File not found in GridFS') {
      throw error;
    }
    throw new Error(`Failed to delete file: ${error.message}`);
  }
};

/**
 * Delete old PDFs older than specified months
 * @param {Number} olderThanMonths - Number of months (default: 6)
 * @returns {Promise<Number>} - Number of files deleted
 */
const deleteOldPDFs = (olderThanMonths = 6) => {
  return new Promise((resolve, reject) => {
    if (!gridfsBucket) {
      return reject(new Error('GridFS not initialized'));
    }

    const cutoffDate = new Date();
    cutoffDate.setMonth(cutoffDate.getMonth() - olderThanMonths);

    gridfsBucket.find({ 
      uploadDate: { $lt: cutoffDate }
    }).toArray((err, files) => {
      if (err) {
        return reject(err);
      }

      if (!files || files.length === 0) {
        return resolve(0);
      }

      let deletedCount = 0;
      const deletePromises = files.map(file => {
        return deletePDFFromGridFS(file._id.toString())
          .then(() => {
            deletedCount++;
          })
          .catch(error => {
            console.error(`Error deleting file ${file._id}:`, error);
          });
      });

      Promise.all(deletePromises)
        .then(() => resolve(deletedCount))
        .catch(reject);
    });
  });
};

module.exports = {
  initGridFS,
  uploadPDFToGridFS,
  getPDFFromGridFS,
  deletePDFFromGridFS,
  deleteOldPDFs
};
