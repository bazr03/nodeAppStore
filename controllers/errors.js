exports.get404 = (req, res, next) => {// path root "/" es el default
//res.status(404).send('<h1>Page not found</h1>');
//res.status(404).sendFile( path.join(__dirname, 'views' , '404.html') );
    res.status(404).render('404', {pageTitle:'Página no Encontrada', path:''});
} 