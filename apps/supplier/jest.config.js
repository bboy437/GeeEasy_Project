module.exports = {
  name: "supplier",
  preset: "../../jest.config.js",
  coverageDirectory: "../../coverage/apps/supplier",
  snapshotSerializers: [
    "jest-preset-angular/AngularSnapshotSerializer.js",
    "jest-preset-angular/HTMLCommentSerializer.js"
  ]
};
