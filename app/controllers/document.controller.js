const db = require("../models");
const Document = db.document;



exports.getAllDocs = async () => {
    var result_docs = await Document.findAll();
    return result_docs;
}


exports.getDoc = async (doc_id) => {
    var result_doc = await Document.findOne({ where: { id: doc_id } });
    return result_doc;
}

exports.addDoc = async (doc) => {
    var result_doc = await Document.create({ id: doc.id, doc: doc.doc });
    return result_doc;
}

exports.updateDoc = async (doc) => {

    var result_doc = await Document.update({doc: doc.doc},{where: { id: doc.id }});
    return result_doc;
}