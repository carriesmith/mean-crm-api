// By default JS doesn't have a way to pass information between
// different files. module.exports() is Node's way of fixing this problem.

// module.exports() can be thought of as a giant object.
// As things are pulled into the app with require() everything is
// added to this object.

module.exports = {
  'port': process.env.PORT || 8080,
  'database': 'mongodb://localhost:27017/mean-crm-api-db',
  'secret': 'thiswouldntreallygoongit',
  'userTokenExp': 1440 // *** is this bad practice ???
};