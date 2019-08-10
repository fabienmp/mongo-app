const mongoose = require('mongoose');
const Schema = mongoose.Schema;
if (mongoose.connection.readyState === 0)
    mongoose.connect(require('../connection-config.js'))
    .catch(err => {
        console.error('mongoose Error', err)
    });

let ArticleSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    image_url: String,
    text: String,
    link: {
        type: String,
        required: true
    },
    pusblished_on: {
        type: Date,
        default: Date.now
    },
    note: {
        type: Schema.Types.ObjectId,
        ref: "Note"
    },
    saved: {
        type: Boolean,
        default: false,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

ArticleSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

ArticleSchema.pre('update', function () {
    this.constructor.update({
        _id: this._id
    }, {
        $set: {
            updatedAt: Date.now()
        }
    });
});

ArticleSchema.pre('findOneAndUpdate', function () {
    this.constructor.update({
        _id: this._id
    }, {
        $set: {
            updatedAt: Date.now()
        }
    });
});

/** @name db.Article */
module.exports = mongoose.model('Article', ArticleSchema);