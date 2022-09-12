const Accounts = require('./accounts-model')


exports.checkAccountPayload = (req, res, next) => {
  try {
    const { name, budget } = req.body;

    if (name === undefined || budget === undefined) {
      next({ status: 400, message: "name and budget are required"})
      return;
    }
    const trimName = name.trim();
    if (trimName.length < 3 || trimName.length > 100) {
      next({ status: 400, message: "name of account must be between 3 and 100"})
      return;
    }
    if (isNaN(budget) || typeof budget !== 'number') {
      next({ status: 400, message: "budget of account must be a number"});
      return;
    } 
    if (budget < 0 || budget > 1000000) {
      next({ status: 400, message: "budget of account is too large or too small"})
      return;
    }

    req.newAccount = { ...req.body, name: trimName }
    next();

  } catch (err) {
    next(err)
  }
}

exports.checkAccountNameUnique = async (req, res, next) => {
  try {
    const allAccounts = await Accounts.getAll();

    const matchedAccounts = allAccounts.filter(account => account.name.trim() === req.newAccount.name);

    if (matchedAccounts.length) {
      next({ status: 400, message: "that name is taken"})
    } else {
      next()
    }
  } catch (err) {
    next(err)
  }
}

exports.checkAccountId = async (req, res, next) => {
  try {
    const account = await Accounts.getById(req.params.id)
    if (account) {
      req.existingAcc = account;
      next()
    } else {
      next({ status: 404, message: `account not found` })
    }
  } catch (err) {
    next(err)
  }
}
