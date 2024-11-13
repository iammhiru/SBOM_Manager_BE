module.exports.USER_STATUS = { ACTIVE: "ACTIVE", INACTIVE: "INACTIVE" };
module.exports.PROJECT_STATUS = { ACTIVE: "ACTIVE", INACTIVE: "INACTIVE" };
module.exports.SBOM_STATUS = { ACTIVE: "ACTIVE", INACTIVE: "INACTIVE" };
module.exports.ORGANIZATION_ADMIN_STATUS = { ACTIVE: "ACTIVE", INACTIVE: "INACTIVE" };
module.exports.MIME_TYPE = {
  IMAGE_JPEG: "image/jpeg",
  VIDEO_MP4: "video/mp4",
};

module.exports.SBOM_STANDARD = {
  "syft-json": {
    FORMAT: "JSON",
    STANDARD: "SYFT",
  },
  "cyclonedx-xml": {
    FORMAT: "XML",
    STANDARD: "CYCLONEDX@1.6",
  },  
  "cyclonedx-xml@1.5": {
    FORMAT: "XML",
    STANDARD: "CYCLONEDX@1.5",
  },  
  "cyclonedx-json": {
    FORMAT: "JSON",
    STANDARD: "CYCLONEDX@1.6",
  },  
  "cyclonedx-json@1.5": {
    FORMAT: "JSON",
    STANDARD: "CYCLONEDX@1.5",
  },  
  "spdx-tag-value": {
    FORMAT: "XML",
    STANDARD: "SPDX@2.3",
  },  
  "spdx-tag-value@2.2": {
    FORMAT: "XML",
    STANDARD: "SPDX@2.2",
  },  
  "spdx-json": {
    FORMAT: "JSON",
    STANDARD: "SPDX@2.3",
  },
  "spdx-json@2.2": {
    FORMAT: "JSON",
    STANDARD: "SPDX@2.2",
  },
}
module.exports.MIME_EXTENSION = {
  IMAGE_JPEG: "jpg",
  VIDEO_MP4: "mp4",
};

module.exports.ACTIVE_STATUS = { ACTIVE: "ACTIVE", INACTIVE: "INACTIVE" };
module.exports.PAGE_PAGINATION = 0;
module.exports.LIMIT_PAGINATION = 10;
