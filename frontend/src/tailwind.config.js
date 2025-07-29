/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        // 确保这行包含了所有 .jsx 文件
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {},
    },
    plugins: [],
}
