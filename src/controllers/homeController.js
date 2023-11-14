
let getHomePage =(req, res) =>{
    return res.render('homePage.ejs');
}

let getMainPage =(req, res) =>{
    return res.render('mainPage.ejs');
}

module.exports = {
    getHomePage: getHomePage,
    getMainPage: getMainPage,
}