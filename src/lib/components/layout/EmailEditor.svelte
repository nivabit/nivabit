<script lang="ts">
    import { onMount } from "svelte";
  
    export let value: string = "";
    export let onChange: (val: string) => void;
  
    let editor: any;
    let editorEl: HTMLDivElement;
  
    onMount(async () => {
        const grapesjsModule = await import("grapesjs");
        const grapesjs = grapesjsModule.default;
        const mjmlPluginModule = await import("grapesjs-mjml");
        const mjmlPlugin = mjmlPluginModule.default;

        await import("grapesjs/dist/css/grapes.min.css");

        editor = grapesjs.init({
            container: editorEl,
            fromElement: false,
            height: "600px",
            width: "100%",
            storageManager: false,
            plugins: [mjmlPlugin],
            canvas: {
            styles: [
                "https://fonts.googleapis.com/css?family=Inter:400,500,600"
            ]
            }
        });

        // MJML needs a root structure
        const defaultMJML = `
            <mjml>
            <mj-head>
                <mj-preview>Newsletter Preview</mj-preview>
                <mj-style inline="inline">.body { font-family: Inter, sans-serif; }</mj-style>
            </mj-head>
            <mj-body background-color="#f9f9f9">
                <mj-section>
                <mj-column>
                    <mj-text font-size="20px" font-weight="bold" color="#333333">Welcome to our Newsletter</mj-text>
                    <mj-text font-size="14px" color="#555555">Start building your content by dragging blocks from the left panel.</mj-text>
                </mj-column>
                </mj-section>
            </mj-body>
            </mjml>
        `;

        if (value) {
            editor.setComponents(value);
        } else {
            editor.setComponents(defaultMJML);
        }

        editor.on("update", () => {
            const mjml = editor.getHtml();
            onChange?.(mjml);
        });
    });


  </script>
  
  <div bind:this={editorEl} class="border rounded-lg min-h-[600px]"></div>
  