class Visitor {
    visit(tree) {
       this._visit(tree);
    }
    _visit(node) {
        const type = node.type;
        const method = 'visit_' + type;
        if (!this[method] && node.children) {
            this.visitChildren(node);
        } else if (this[method]) {
            this[method](node);
        }
    }
    visitChildren(node) {
        const nodes = node.children;
        if (!nodes) {
            return;
        }
        nodes.forEach(child => {
            this._visit(child);
        })
    }
}

export { Visitor };