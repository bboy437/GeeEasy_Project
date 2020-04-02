module.exports = {
  name: "theme-dealer",
  preset: "../../jest.config.js",
  coverageDirectory: "../../coverage/libs/theme-dealer",
  snapshotSerializers: [
    "jest-preset-angular/AngularSnapshotSerializer.js",
    "jest-preset-angular/HTMLCommentSerializer.js"
  ]
};
