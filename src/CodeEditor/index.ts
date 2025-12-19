import "../monacosetup.ts";
import "../monacoLanguages.ts";
import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
import { IInputs, IOutputs } from "./generated/ManifestTypes";

export class CodeEditor implements ComponentFramework.StandardControl<IInputs, IOutputs> {
    /**
     * Empty constructor.
     */
    constructor() {
        // Empty
    }

    // Private fields for DOM elements and state
    private _container!: HTMLDivElement;
    private _editorHost!: HTMLDivElement;
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    private _editor: any;
    //eslint-disable-next-line @typescript-eslint/no-inferrable-types
    private _value: string = "";
    private _notifyOutputChanged!: () => void;
    private _isTyping = false;
    private _typingTimer?: number;

    // private _handler = () => {
    //     this._isTyping = true;
    //     this._value = this._editor?.getValue() ?? "";
    //     this._notifyOutputChanged?.();
    //     // eslint-disable-next-line @typescript-eslint/no-explicit-any
    //     window.clearTimeout((this as any)._typingTimer);
    //     // eslint-disable-next-line @typescript-eslint/no-explicit-any
    //     (this as any)._typingTimer = window.setTimeout(() => (this._isTyping = false), 400);
    // }
    /**
     * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
     * Data-set values are not initialized here, use updateView.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
     * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
     * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
     * @param container If a control is marked control-type='standard', it will receive an empty div element within which it can render its content.
     */
    public init(
        context: ComponentFramework.Context<IInputs>,
        notifyOutputChanged: () => void,
        state: ComponentFramework.Dictionary,
        container: HTMLDivElement
    ): void {
        // Root Container
        this._container = container;
        this._container.style.height = "100%";
        this._container.style.width = "100%";

        //Monaco Host
        this._editorHost = document.createElement("div");
        this._editorHost.style.height = "100%";
        this._editorHost.style.width = "100%";
        this._editorHost.style.minHeight = "220px"; // important for model-driven sections

        this._container.appendChild(this._editorHost);
        this._notifyOutputChanged = notifyOutputChanged;

        const initial = context.parameters.code.raw ?? "";

        this._editor = monaco.editor.create(this._editorHost, {
            value: initial,
            language: "json",             // Phase 1: start with json. We'll make it configurable later.
            automaticLayout: true,        // essential in model-driven apps
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            wordWrap: "on",
        });

        this._value = initial;

        // Change handler (debounced notifyOutputChanged)
        this._editor.onDidChangeModelContent(() => {
            this._isTyping = true;
            this._value = this._editor.getValue();

            // debounce notifyOutputChanged so save is smooth
            if (this._typingTimer) window.clearTimeout(this._typingTimer);
            this._typingTimer = window.setTimeout(() => {
                this._isTyping = false;
                this._notifyOutputChanged();
            }, 350);
        });
    }


    /**
     * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
     */
    public updateView(context: ComponentFramework.Context<IInputs>): void {
        if (!this._editor) return;

        const incoming = context.parameters.code.raw ?? "";

        // don’t overwrite user while typing
        if (this._isTyping) return;

        // only update editor if different
        if (incoming !== this._editor.getValue()) {
            this._value = incoming;
            this._editor.setValue(incoming);
        }
    }


    /**
     * It is called by the framework prior to a control receiving new data.
     * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as "bound" or "output"
     */
    public getOutputs(): IOutputs {
        return {
            code: this._value,
        };
    }



    /**
     * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
     * i.e. cancelling any pending remote calls, removing listeners, etc.
     */
    public destroy(): void {
        if (this._typingTimer) window.clearTimeout(this._typingTimer);
        if (this._editor) {
            this._editor.dispose();
        }
    }

}
