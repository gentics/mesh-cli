const meshWrapper = require('./mesh-api-wrapper');
const config = require.main.require('./config');

async function getTagFamilies() {
  return meshWrapper.api.project(config.projectName).tagFamilies.get({}, await meshWrapper.getMeshToken())
    .then(response => response.data.map(it => it.name))
}

async function createTagFamily(name) {
  return meshWrapper.api.project(config.projectName).tagFamilies.post({name}, {}, await meshWrapper.getMeshToken())
}

/**
 * Creates tag families if they don't exist yet.
 */
async function updateTagFamilies() {
  const localTagFamilies = config.tagFamilies
  if(localTagFamilies){  
    const meshTagFamilies = await getTagFamilies()
    const newTagFamilies = difference(localTagFamilies, meshTagFamilies)

    if (newTagFamilies.length > 0) {
      console.log("Creating tag families", newTagFamilies)
    } else {
      console.log("No new tag families found.")
    }

    for (family of newTagFamilies) {
      await createTagFamily(family)
    }
  }else{
    console.log("No local tag families");
  }
}

/**
 * Returns all elements of arr1 that are not in arr2
 * @param {array} arr1
 * @param {array} arr2
 */
function difference(arr1, arr2) {
  return arr1.filter(it => arr2.indexOf(it) < 0)
}

exports.updateTagFamilies = updateTagFamilies
