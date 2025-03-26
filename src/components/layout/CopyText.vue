<template>
    <div class="container">
        <button @click="setCopied(true) ; copyText(copiedText)" >
            <div class="icon-container">
                <svg class="clippy-icon" :style="clippyStyle" width="16" height="16" viewBox="0 0 16 16" fill="none"
                    stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M5.75 4.75H10.25V1.75H5.75V4.75Z" />
                    <path
                        d="M3.25 2.88379C2.9511 3.05669 2.75 3.37987 2.75 3.75001V13.25C2.75 13.8023 3.19772 14.25 3.75 14.25H12.25C12.8023 14.25 13.25 13.8023 13.25 13.25V3.75001C13.25 3.37987 13.0489 3.05669 12.75 2.88379" />
                </svg>
                <svg class="check-icon" :style="checkStyle" width="16" height="16" viewBox="0 0 16 16" fill="none"
                    stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M13.25 4.75L6 12L2.75 8.75" />
                </svg>
            </div>
        </button>
    </div>
</template>

<script>
export default {
    data() {
        return {
            copied: false
        }
    },
    props: {
        copiedText: {
            required: true,
        }, // Table copiedText
    },
    computed: {
        clippyStyle() {
            return {
                color: '#6a737d', // Equivalent to colors.gray[8]
                position: 'absolute',
                top: 0,
                left: 0,
                strokeDasharray: 50,
                strokeDashoffset: this.copied ? -50 : 0,
                transition: 'all 300ms ease-in-out'
            }
        },
        checkStyle() {
            return {
                color: '#2cbe4e', // Equivalent to colors.green[5]
                position: 'absolute',
                top: 0,
                left: 0,
                strokeDasharray: 50,
                strokeDashoffset: this.copied ? 0 : -50,
                transition: 'all 300ms ease-in-out',
                visibility: this.copied ? 'visible' : 'hidden'
            }
        }
    },
    methods: {
        setCopied(value) {
            this.copied = value
        },
        copyText(text) {
            navigator.clipboard.writeText(text);
        },
    },
    watch: {
        copied(newCopied) {
            if (newCopied) {
                this.resetCopiedTimeout = setTimeout(() => {
                    this.copied = false
                }, 1000)
            }
        }
    },
    beforeDestroy() {
        // Vue 2 lifecycle method
        if (this.resetCopiedTimeout) {
            clearTimeout(this.resetCopiedTimeout)
        }
    },
    beforeUnmount() {
        // Vue 3 lifecycle method
        if (this.resetCopiedTimeout) {
            clearTimeout(this.resetCopiedTimeout)
        }
    }
}
</script>

<style scoped>
.container {    
    display: flex;
    justify-content: center;
    align-items: center;
}

button {
    appearance: none;
    padding: 8px;
    border: 0;
    outline: 0;
    cursor: pointer;
}

.icon-container {
    position: relative;
    height: 16px;
    width: 16px;
}

.clippy-icon,
.check-icon {
    position: absolute;
    top: 0;
    left: 0;
}
</style>