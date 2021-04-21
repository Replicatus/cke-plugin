import Command from '@ckeditor/ckeditor5-core/src/command';

export default class BookmarkCommand extends Command {
    constructor(editor) {
        super(editor);

        this.set("isRouterLink", false);
    }

    execute(routerName) {
        const editor = this.editor;
        const modelSelection = editor.model.document.selection;

        editor.model.change(modelWriter => {
            if (modelSelection.isCollapsed) {
                routerName = routerName || '';

                const router = modelWriter.createElement('router-link', { to: routerName });
                editor.model.insertContent(router);

                modelWriter.setSelection(router, 'on');
            }
            else {
                var elm = modelSelection.getSelectedElement();
                if (elm && elm.is('element')) {
                    if (elm.hasAttribute('name')) {
                        modelWriter.setAttribute('name', routerName, elm);
                    }
                }
            }
        });
    }

    refresh() {
        const model = this.editor.model;
        const modelDocument = model.document;
        const elmSelected = modelDocument.selection.getSelectedElement();

        this.isRouterLink = false;

        if (elmSelected) {
            this.value = elmSelected.getAttribute('name');
            this.isRouterLink = elmSelected.hasAttribute('name');
        }
        else {
            this.value = null;
            this.isRouterLink = false;
        }

        const isAllowed = model.schema.checkChild(modelDocument.selection.focus.parent, 'router-link');
        this.isEnabled = isAllowed;
    }
}