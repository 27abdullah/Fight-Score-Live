import signUpGoogle from "./signUpGoogle";

export default function GoogleProvider() {
    return (
        <>
            <h2>Continue with</h2>
            <button onClick={signUpGoogle}>Google</button>
        </>
    );
}
