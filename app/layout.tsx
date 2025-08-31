import './globals.css';

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className="h-screen overflow-hidden bg-black">
                {children}
            </body>
        </html>
    );
}
