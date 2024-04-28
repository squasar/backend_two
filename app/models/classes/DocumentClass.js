class DocumentClass {
    id = "";
    doc = "";
    

    constructor() {
        //this.name = "unknown";
    }
    
}

res_document_ob_class = {};
res_document_ob_class.doc_ob_class = DocumentClass;
res_document_ob_class.doc_ob_obj_class = new DocumentClass();
module.exports = res_document_ob_class;