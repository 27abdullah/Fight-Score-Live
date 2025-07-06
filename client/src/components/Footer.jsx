export default function Footer() {
    return (
        <footer className="text-white bg-dune p-2 text-center max-w-full max-h-min">
            <p className="text-xs">
                &copy; {new Date().getFullYear()} Fight Score Live. All rights
                reserved.
            </p>
            <p className="text-xs">
                Enquiries, bugs, suggestions: contact@fightscore.live
            </p>
        </footer>
    );
}
