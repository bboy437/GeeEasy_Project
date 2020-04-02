module.exports = {
  name: "dealer",
  preset: "../../jest.config.js",
  coverageDirectory: "../../coverage/apps/dealer",
  snapshotSerializers: [
    "jest-preset-angular/AngularSnapshotSerializer.js",
    "jest-preset-angular/HTMLCommentSerializer.js"
  ]
};
