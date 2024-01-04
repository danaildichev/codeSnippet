class CodeSnippetsHandler
{
    constructor(codeSnippets)
    {
        this.codeSnippets = codeSnippets;
        this.initCodeSnippets();
    }

    /**
     * Determine if a code snippet has overflow along the X axis
     *
     * @param element
     *
     * @return {boolean}
     */
    hasOverflowX(element)
    {
        return element.scrollWidth > Math.max(element.offsetWidth, element.clientWidth);
    }

    /**
     * Determine if a code snippet has overflow along the Y axis
     *
     * @param element
     *
     * @return {boolean}
     */
    hasOverflowY(element)
    {
        return element.scrollHeight > Math.max(element.offsetHeight, element.clientHeight);
    }


    /**
     * If a code snippet has overflow-x, add some extra bottom padding for the scroll bar in the code snippet UI and
     * the code snippet modalBox UI
     *
     * @param codeSnippet
     *
     * @return undefined
     */
    handleInitOverflowX(codeSnippet)
    {
        if (this.hasOverflowX(codeSnippet))
        {
            // add bottom padding to code snippet UI
            codeSnippet.classList.add('pb-6');

            // if code snippet has modal, add bottom padding to code snippet modalBox UI
            const modalBoxForCodeSnippet = document.querySelector(`#codeSnippetModalBox_${codeSnippet.id}`);
            if (modalBoxForCodeSnippet !== null)
            {
                modalBoxForCodeSnippet.classList.add('pb-6');
            }

        }
    }


    /**
     * Handles style changes for the height tooltip on input events of the height slider
     *
     * @param {Event} ev When the height range input slider is being used
     *
     * @return undefined
     */
    handleInputEventForOverFlowYMaxHeight(ev)
    {
        // get the range input and it's value
        const thisMaxHeightInput = ev.target;
        const wouldBeHeight = thisMaxHeightInput.value;

        // get the tooltip and update its text
        const thisMaxHeightTooltip = thisMaxHeightInput.parentElement;
        thisMaxHeightTooltip.dataset.tip = `${wouldBeHeight}% of viewport`;

        // update the bg color of the tooltip based on the input's value
        if(wouldBeHeight < 16)
        {
            thisMaxHeightTooltip.classList.remove('tooltip-warning');
            thisMaxHeightTooltip.classList.add('tooltip-error');
        }

        if(wouldBeHeight > 15 && wouldBeHeight < 35)
        {
            thisMaxHeightTooltip.classList.remove('tooltip-error');
            thisMaxHeightTooltip.classList.add('tooltip-warning');
        }

        if(wouldBeHeight > 34)
        {
            thisMaxHeightTooltip.classList.remove('tooltip-warning');
        }
    }


    /**
     * Handles UI changes for the code snippet's max-height and tooltip text
     * when the height input's change event occurs
     *
     * @param {Event} ev When the height range input value gets changed
     *
     * @return undefined
     */
    handleChangeEventForOverFlowYMaxHeight(ev)
    {
        // get height input and its new value
        const thisMaxHeightInput = ev.target;
        const newHeight = thisMaxHeightInput.value;

        // get the code snippet and its tooltip
        const snippetEl = document.getElementById(thisMaxHeightInput.dataset.codeSnippet);
        const thisMaxHeightTooltip = thisMaxHeightInput.parentElement;

        // update the code snippet's max height
        snippetEl.style.maxHeight = `${newHeight}vh`;

        // update the tooltip's text
        thisMaxHeightTooltip.dataset.tip = `${newHeight}% of viewport`;

        // reset the tooltip's style
        thisMaxHeightTooltip.classList.remove('tooltip-error');
        thisMaxHeightTooltip.classList.remove('tooltip-warning');
    }


    /**
     * Determines if a code snippet component needs to show it's max-height UI.
     * If so, it assigns input and change event listeners to the max-height UI.
     *
     * @param {HTMLElement} codeSnippet A code snippet component
     *
     * @return undefined
     */
    handleInitOverflowY(codeSnippet)
    {
        // if a code snippet has overflow-y
        if (this.hasOverflowY(codeSnippet))
        {
            // get and show the code snippet's hidden container for maxHeight button and input range
            const containerForOverflowY_maxHeight = document.getElementById(`containerFor_input_maxHeight_${codeSnippet.id}`);
            containerForOverflowY_maxHeight.classList.remove('hidden');

            // get this code snippet's maxHeight input
            const inputForOverflowY_maxHeight = document.getElementById(`input_maxHeight_${codeSnippet.id}`);

            // assign event listener for UI update on input
            inputForOverflowY_maxHeight.addEventListener('input', (ev) => {this.handleInputEventForOverFlowYMaxHeight(ev)} );

            // assign event listener for UI update on change
            inputForOverflowY_maxHeight.addEventListener('change', (ev) => {this.handleChangeEventForOverFlowYMaxHeight(ev)} );

        }
    }


    /**
     * Checks each code snippet for overflow on X and Y axis
     *
     * @return undefined
     */
    handleInitOverflow()
    {
        for (const codeSnippet of this.codeSnippets)
        {
            this.handleInitOverflowX(codeSnippet);
            this.handleInitOverflowY(codeSnippet);
        }
    }


    /**
     * Handles style changes for the copy button. For use with successful or failed copy button events.
     *
     * @param {HTMLElement} eventTarget The copy button that was pressed
     * @param {String} bgColor A CSS class
     * @param {String} hoverColor A CSS class
     * @param {String} textColor A CSS class
     * @param {String} scale A CSS class
     * @param {Number} delay Optional. For timeout. Default 500.
     *
     * @return undefined
     */
    toggleCopyButtonStyle(eventTarget, bgColor, hoverColor, textColor, scale, delay = 500)
    {
        eventTarget.classList.toggle(bgColor);
        eventTarget.classList.toggle(hoverColor);
        eventTarget.classList.toggle(textColor);
        eventTarget.classList.toggle(scale);
        setTimeout(() =>
        {
            eventTarget.classList.toggle(scale);
            eventTarget.classList.toggle(textColor);
            eventTarget.classList.toggle(hoverColor);
            eventTarget.classList.toggle(bgColor);

        }, delay);
    }


    /**
     * Handle style changes for the copy button if user is unable to perform the copy action
     *
     * @param {HTMLElement} eventTarget The copy button that was pressed
     * @param {String} bgColor A CSS class
     * @param {String} hoverColor A CSS class
     * @param {String} textColor A CSS class
     * @param {String} scale A CSS class
     * @param {Error} error From a rejected Promise
     * @param {Number} delay Optional. For timeout. Default 500.
     *
     * @return undefined
     */
    onCopyCodeSnippetFailure(eventTarget, bgColor, hoverColor, textColor, scale, error, delay = 500)
    {
        // by default the copy button is styled for success. the success class is also overridden.
        // on a successful copy event the override is removed
        // before removing the override, change the btn-success class to btn-error
        eventTarget.classList.replace('btn-success', 'btn-error');

        // toggle the button class and alert the user that the copy event failed
        this.toggleCopyButtonStyle(eventTarget, bgColor, hoverColor, textColor, scale, delay);
        alert(`ERROR: Unable to copy code snippet: ${error.message}`)
        setTimeout(() =>
        {
            // reset the btn-error class to btn-success
            eventTarget.classList.replace('btn-error', 'btn-success');

        }, delay*2);
    }


    /**
     * Get the code snippet's inner text
     *
     * @param {Event} ev The click/tap that occurred on a copy button
     *
     * @return {string}
     */
    getCodeSnippetTextFromCopyButtonEvent(ev)
    {
        const copyButton = ev.target;
        const copyTarget = copyButton.dataset.codeSnippet;
        const codeSnippet = document.getElementById(copyTarget);
        return codeSnippet.innerText;
    }


    /**
     * Handles clipboard.writeText() and UI events for successful or failed copy events
     *
     * @param {HTMLElement} copyButton The copy button that was clicked/tapped on
     * @param {String} text The inner text of the code snippet that should be copied to clipboard
     *
     * @return undefined
     */
    performCopy(copyButton, text)
    {
        navigator.clipboard.writeText(`${text}`)
        .then(this.toggleCopyButtonStyle(copyButton, 'bg-base-60', 'hover:bg-base-80', 'text-base-content', 'scale-110'))
        .catch((e) =>
        {
            this.onCopyCodeSnippetFailure(copyButton, 'bg-base-60', 'hover:bg-base-80', 'text-base-content', 'scale-110', e);
        });
    }


    /**
     * Get the text of a code snippet and copy it to the clipboard
     *
     * @param {Event} ev The click/tap that occurred on a copy button
     *
     * @return undefined
     */
    copyCodeSnippet(ev)
    {
        const text = this.getCodeSnippetTextFromCopyButtonEvent(ev);
        this.performCopy(ev.target, text);
    }


    /**
     * Assigns click event listener to each copy button of each code snippets that is being handled by this class instance
     *
     * @return undefined
     */
    handleInitCopyButtons()
    {
        for (const codeSnippet of this.codeSnippets)
        {
            const copyButton = document.getElementById(`btn_copyCodeSnippet_${codeSnippet.id}`);
            copyButton.addEventListener('click', (ev) => {this.copyCodeSnippet(ev)});
        }
    }


    /**
     * Functions to run when an instance of this class is constructed
     *
     */
    initCodeSnippets()
    {
        // handle UI changes and assign event listeners if a code snippet has X and/or Y overflow
        this.handleInitOverflow();

        // assign copy event listener to each copy button of each code snippet
        this.handleInitCopyButtons();
    }

}
