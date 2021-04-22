import Command from '@ckeditor/ckeditor5-core/src/command';

export default class BookmarkCommand extends Command {
    constructor(editor) {
        super(editor);

        this.set("isRouterLink", false);
    }

    execute(routerValue) {
        const editor = this.editor;
        const modelSelection = editor.model.document.selection;
        editor.model.change(modelWriter => {
            if (modelSelection.isCollapsed) {
                routerValue = routerValue || '';

                const router = modelWriter.createElement('router-link', {
                    // name:value,
                    to: routerValue
                }
                );
                editor.model.insertContent(router);
                console.log("execute router", router)
                modelWriter.setSelection(router, 'on');
            }
            else {
                let elm = modelSelection.getSelectedElement();
                if (elm && elm.is('element')) {
                    if (elm.hasAttribute('to')) {
                        modelWriter.setAttribute('to', routerValue, elm);
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
            this.value = elmSelected.getAttribute('to');
            this.isRouterLink = elmSelected.hasAttribute('to');
        }
        else {
            this.value = null;
            this.isRouterLink = false;
        }

        const isAllowed = model.schema.checkChild(modelDocument.selection.focus.parent, 'router-link');
        this.isEnabled = isAllowed;
    }
}