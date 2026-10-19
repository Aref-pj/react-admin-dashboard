import { RouterProvider } from "react-router-dom";
import router from "./app/router/router";
import useThemeStore from "./app/store/theme/theme.store";

export default function App() {

    // Theme
    const theme = useThemeStore((state) => state.theme);

    return (
        <div className={`${theme} h-screen bg-c-background transition-colors text-c-text overflow-x-hidden`}>
            <RouterProvider router={router}/>
        </div>
    );
}