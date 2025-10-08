// এই মিডলওয়্যারটি double-submit cookie প্যাটার্ন ব্যবহার করে CSRF পরীক্ষা করে
// এটি `X-CSRF-Token` হেডার ও `csrfToken` কুকি মিলছে কি না দেখে।
module.exports = (req, res, next) => {
  const headerToken = req.headers['x-csrf-token'] || req.headers['x-xsrf-token'];
  const cookieToken = req.cookies && req.cookies.csrfToken;

  if (!headerToken || !cookieToken) {
    return res.status(403).json({ message: 'CSRF টোকেন অনুপস্থিত' });
  }

  if (headerToken !== cookieToken) {
    return res.status(403).json({ message: 'CSRF টোকেন মিলছে না' });
  }

  next();
};
