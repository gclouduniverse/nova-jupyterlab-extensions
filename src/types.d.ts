/** Custom and overriden type definitions */

// Fix members of the gapi.client namespaces until DefinitelyTyped is updated
declare namespace gapi.client {
  namespace servicemanagement {
    const services: ServicesResource;
  }
  namespace storage {
    const buckets: BucketsResource;
    const objects: ObjectsResource;
  }
}
