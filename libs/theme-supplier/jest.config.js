module.exports = {
  name: "theme-supplier",
  preset: "../../jest.config.js",
  coverageDirectory: "../../coverage/libs/theme-supplier",
  snapshotSerializers: [
    "jest-preset-angular/AngularSnapshotSerializer.js",
    "jest-preset-angular/HTMLCommentSerializer.js"
  ]
};
