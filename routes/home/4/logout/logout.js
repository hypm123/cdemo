module.exports = function(app) {
    app.get('/logout', (req, res) => {
        res.clearCookie('session_id');
        res.send('Đăng xuất thành công. Cookie đã được xóa.');
        // res.redirect('/home');
    });
}