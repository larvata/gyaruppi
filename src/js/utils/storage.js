const STORAGE_TYPE = {
  LOCAL: 'local',
  SYNC: 'sync'
};

const getStorage=(storageType = STORAGE_TYPE.LOCAL)=>{
  let storage = null;
  if (storageType === STORAGE_TYPE.LOCAL) {
    storage = chrome.storage.local;
  }
  else if(storageType === STORAGE_TYPE.SYNC){
    storage = chrome.storage.sync;
  }
  return storage;
};

const getStorageGet=(storageType)=>{
  let storage = getStorage(storageType);

  return (keys)=>{
    return new Promise((resolve, reject)=>{
      storage.get(keys, (ret)=>{
        if (chrome.runtime.lastError) {
          console.log('Runtime Error Occured. ', chrome.runtime.lastError.message);
          reject(chrome.runtime.lastError);
        }
        else{
          resolve(ret);
        }
      });
    });
  };
};

const getStorageSet=(storageType)=>{
  let storage = getStorage(storageType);

  return (items)=>{
    return new Promise((resolve, reject)=>{
      storage.set(items, ()=>{
        if (chrome.runtime.lastError) {
          console.log('Runtime Error Occured. ', chrome.runtime.lastError.message);
          reject(chrome.runtime.lastError);
        }
        else{
          resolve();
        }
      });
    });
  };
};

export const localStorage ={
  get: getStorageGet(STORAGE_TYPE.LOCAL),
  set: getStorageSet(STORAGE_TYPE.LOCAL)
};

export const syncStorage = {
  get: getStorageGet(STORAGE_TYPE.SYNC),
  set: getStorageSet(STORAGE_TYPE.SYNC)
};
