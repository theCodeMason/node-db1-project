const Accounts = require('./accounts-model');
const {
  checkAccountPayload,
  checkAccountNameUnique,
  checkAccountId,
} = require('./accounts-middleware');

const router = require('express').Router()

router.get('/', (req, res, next) => {
  try {
    Accounts.getAll()
      .then(accounts => {
        res.status(200).json(accounts)
      })
  } catch (err) {
    next(err)
  }
})

router.get('/:id', checkAccountId, (req, res, next) => {
  try {
    res.status(200).json(req.existingAcc)
  } catch (err) {
    next(err)
  }
})

router.post('/', checkAccountPayload, checkAccountNameUnique, (req, res, next) => {
  try {
    Accounts.create(req.newAccount)
      .then(account => {
        res.status(201).json(account)
      })
  } catch (err) {
    next(err)
  }
})

router.put('/:id', checkAccountId, checkAccountPayload, (req, res, next) => {
  try {
    Accounts.updateById(req.params.id, req.body)
      .then(updatedAccount => {
        res.status(200).json(updatedAccount)
      })
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', checkAccountId, (req, res, next) => {
  try {
    Accounts.deleteById(req.params.id)
      .then(deletedAccount => {
        res.status(200).json(deletedAccount)
      })
  } catch (err) {
    next(err);
  }
})

router.use((err, req, res, next) => { // eslint-disable-line
  res.status(err.status || 500).json({ message: err.message })
})

module.exports = router;
