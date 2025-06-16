import "./Footer.css";

function Footer() {
    return (
        <div className="footer">
            <div className="footer-grid">
                <a href="/whoevenknows">Account</a>
                <a href="/whyareyouclickingthis">Media Notice</a>
            </div>
            <div className="footer-grid">
                <a href="/goawayplz">Terms of Service</a>
                <a href="/findsomethingelse">Privacy Notice</a>
            </div>
            <div className="footer-grid">
                <a href="/dudegetalife">Redeem</a>
                <a href="/cantdonothinghere">New Deals</a>
            </div>
            <div className="footer-grid">
                <a href="/bestgotouchsomegrass">FAQ</a>
                <a href="/awayyougo!">© Meow Movies!</a>
            </div>
        </div>
    )
}

export default Footer;