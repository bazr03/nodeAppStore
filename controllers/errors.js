exports.get404 = (req, res, next) => {
  // path root "/" es el default
  //res.status(404).send('<h1>Page not found</h1>');
  //res.status(404).sendFile( path.join(__dirname, 'views' , '404.html') );
  res.status(404).render("404", {
    pageTitle: "Página no Encontrada",
    path: "",
    isAuthenticated: req.session.isLoggedIn
  });
};

exports.get500 = (req, res, next) => {
  // path root "/" es el default
  //res.status(404).send('<h1>Page not found</h1>');
  //res.status(404).sendFile( path.join(__dirname, 'views' , '404.html') );
  res.status(500).render("500", {
    pageTitle: "Error!",
    path: "/500",
    isAuthenticated: req.session.isLoggedIn
  });
};
