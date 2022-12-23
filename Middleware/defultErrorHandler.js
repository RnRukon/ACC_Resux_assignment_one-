exports.defaultErrorHandler = (err, req, res, next) => {
    if (err) {
        res.status(500).send(err.message)

    }
}
