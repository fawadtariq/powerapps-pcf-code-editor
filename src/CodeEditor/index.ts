
import { IInputs, IOutputs } from "./generated/ManifestTypes";

export class CodeEditor implements ComponentFramework.StandardControl<IInputs, IOutputs> {
    /**
     * Empty constructor.
     */
    constructor() {
        // Empty
    }

    // Private fields for DOM elements and state
    private _container: HTMLDivElement | null = null;
    private _textArea: HTMLTextAreaElement | null = null;
    private _notifyOutputChanged: (() => void) | null = null;
    private _value = "";
    private _isTyping = false;
    private _handler = () => {
            this._isTyping = true;
            this._value = this._textArea?.value ?? "";
            this._notifyOutputChanged?.();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            window.clearTimeout((this as any)._typingTimer);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (this as any)._typingTimer = window.setTimeout(() => (this._isTyping = false), 400);
        }
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
        // Add control initialization code
        this._container = container;
        this._notifyOutputChanged = notifyOutputChanged;

        // Create textarea
        this._textArea = document.createElement("textarea");
        this._textArea.rows = 10;
        this._textArea.cols = 80;
        this._textArea.style.boxSizing = "border-box";
        this._textArea.style.width = "100%";
        this._textArea.placeholder = "Enter code...";

        // Input listener updates internal value and notifies framework
        this._textArea.addEventListener("input", this._handler);

        // Append to container
        if (this._container) {
            this._container.appendChild(this._textArea);
        }
    }


    /**
     * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
     */
    public updateView(context: ComponentFramework.Context<IInputs>): void {
        if (!this._textArea) return;

        const incoming = context.parameters.code.raw ?? "";

        // don't overwrite while user is actively typing unless it's actually different than our state
        if (this._isTyping) return;

        if (incoming !== this._textArea.value) {
            this._value = incoming;
            this._textArea.value = incoming;
        }
    }

    /**
     * It is called by the framework prior to a control receiving new data.
     * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as "bound" or "output"
     */
    public getOutputs(): IOutputs {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return { code: this._value } as any;
    }


    /**
     * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
     * i.e. cancelling any pending remote calls, removing listeners, etc.
     */
    public destroy(): void {
        // Add code to cleanup control if necessary
        if (this._textArea && this._container) {

            this._textArea.removeEventListener("input", this._handler);
            try { this._container.removeChild(this._textArea); } catch { /* ignore */ }
        }

        this._textArea = null;
        this._container = null;
        this._notifyOutputChanged = null;
    }
}
