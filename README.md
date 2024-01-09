# codeSnippet

![Static Badge](https://img.shields.io/badge/version-1-blue)

A component to display code

Use `CodeSnippetsHandler.js` to manage one or more instances of the code snippet UI seen in the `index.html` file or the live demo. This class and UI is what I use on my portfolio. It was built with Laravel Blade, Tailwind, Daisy UI, Font Awesome, and a few custom CSS classes extended from Daisy. The demo file a bit stripped down but you might need to look at the code samples I provide on the live demo page. The code snippets component feature a full screen modal, a copy button, and if a code snippet exceeds the default max height of 50vh, there will be a button that shows a dropdown which contains a slider. The user can adjust the height of the code snippet UI.

## Live Demo

[https://danaildichev.net/portfolio/code-samples/code-snippet](https://danaildichev.net/portfolio/code-samples/code-snippet)

## Install

Get a copy of `CodeSnippetsHandler.js` and initialize an instance

```javascript
<script src="/path/to/CodeSnippetsHandler.js"></script>

<script>

    const codeSnippets = document.getElementsByClassName('codeSnippet');
    const codeSnippetsHandler = new CodeSnippetsHandler(codeSnippets);

</script>
```

## Usage

You will need the code snippets and modal components:

Code Snippet
```blade
@props(['id', 'title', 'maxH' => '50', 'extraCSS' => '', 'extraStyles' => ''])

{{-- code snippet container --}}
<div class="my-6">

    {{-- title bar and action buttons --}}
    <div class="relative flex justify-between bg-base-60 rounded-2xl pl-9">

        {{-- title --}}
        <div><p class="text-base-content font-bold">{{ $title }}</p></div>

        {{-- action buttons --}}
        <div class="absolute right-0 join">

            {{-- button: modal --}}
            <button class="join-item btn btn-sm border-0 bg-base-60 hover:bg-base-80 text-base-content rounded-t-none"
                    onclick="codeSnippetModal_{{ $id }}.showModal()">
                <i class="fa-solid fa-maximize mr-1"></i>
                Expand
            </button>
            {{-- button: modal --}}


            {{-- button: height --}}
            <div id="containerFor_input_maxHeight_{{ $id }}" class="join-item dropdown dropdown-end hidden">
                <label for="input_maxHeight_{{ $id }}" tabindex="0" class="btn btn-sm border-0 bg-base-60 hover:bg-base-80 rounded-none">
                    <i class="fa-solid fa-text-height fa-flip-horizontal"></i>
                    Height
                </label>
                <div tabindex="0" class="dropdown-content z-[1] menu p-2 shadow bg-base-60 rounded-box mt-4">

                    {{-- input[range]: snippet max height (wrapped in tooltip) --}}
                    <div class="tooltip tooltip-left" data-tip="{{ $maxH.'% of viewport' }}">
                        <input type="range" name="maxHeight_{{ $id }}" id="input_maxHeight_{{ $id }}" data-code-snippet="{{ $id }}"
                               value="{{ $maxH }}" min="0" max="100"
                               style="writing-mode: vertical-lr; transform: rotate(180deg)">
                    </div>
                    {{-- end input[range]: snippet max height (wrapped in tooltip) --}}

                </div>
            </div>
            {{-- end button: height --}}

            {{-- button: copy --}}
            <button class="join-item btn btn-sm btn-success border-0 bg-base-60 hover:bg-base-80 text-base-content
                           transition duration-300"
                    data-code-snippet="{{ $id }}"
                    id="btn_copyCodeSnippet_{{ $id }}">
                <i class="fa-solid fa-copy mr-1"></i>
                Copy
            </button>
            {{-- end button: copy --}}

        </div>
        {{-- end action buttons --}}

    </div>
    {{-- end title bar and action buttons --}}

    {{-- code snippet --}}
    <div class="bg-base-100 p-6 mx-3 rounded-b-2xl border-4 border-t-0 border-base-60">
        <div id="{{ $id }}"
             style="max-height: {{ $maxH.'vh' }}; transition: max-height 0.5s ease-out; {{ $extraStyles }}"
             class="codeSnippet whitespace-pre overflow-auto font-mono
                    text-white text-xl overscroll-contain {{ $extraCSS }}"
        >{{ $slot }}</div>
    </div>
    {{-- end code snippet --}}

</div>
{{-- end code snippet container --}}

{{-- modal for code snippet --}}
<x-default.modal.basic id="codeSnippetModal_{{ $id }}" class="" boxClass="min-w-full min-h-full rounded-none">
    <div id="codeSnippetModalBox_{{ $id }}"
         class="codeSnippetModalBox whitespace-pre overflow-auto font-mono text-white text-xl"
    >{{ $slot }}</div>
</x-default.modal.basic>
{{-- end modal for code snippet --}}
```

Modal
```blade
@props(['id', 'class', 'boxClass'])

<dialog id="{{ $id }}" class="modal {{ $class }}">
    <div class="modal-box {{ $boxClass }}">
        <form method="dialog">
            <button class="btn hover:btn-accent absolute right-2 top-2 z-10" aria-label="Close">
                <i class="fa-solid fa-x"></i>
            </button>
        </form>
        {{ $slot }}
    </div>
</dialog>
```

Then you can use the code snippet component in your Blade files

```blade
<x-default.widgets.codeSnippet id="codeSnippet-demo" title="Text">
    Lorem ipsum dolor sit amet, consectetur adipisicing elit...
</x-default.widgets.codeSnippet>
```

## API

- The `CodeSnippetsHandler` class does not expose any functions or options.
- The code snippet blade component requires a container element id, a title text string, and optionally allows for overriding the default max height and passing through extra CSS for the UI.

## Issues

Open an issue or hit me up.

## Contributing

PRs accepted.

## License

GPL-3.0
