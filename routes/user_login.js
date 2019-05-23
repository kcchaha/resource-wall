
app.post("/login", (req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    if (!lookupEmail(email)) {
      return res.status(403).send("Invalid email. Try again.");
    } else if (lookupEmail(email)) {
      if (!bcrypt.compareSync(password, users[findUser(email)].password)) {
        return res.status(403).send("Invalid password. Try again.");
      } else if (bcrypt.compareSync(password, users[findUser(email)].password)) { 
        req.session.user_id = findUser(email);
        res.redirect("/urls");
      }
    }
  });