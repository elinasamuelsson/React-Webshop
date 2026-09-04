import React from "react";
import "./Footer.css";

export default function Footer() {
  return (

    <footer>

        {/* ÖVER SEKTION */}
        <div class="div-footer">
            <section>
                <h4>
                    <span>Reel</span>
                    <span>Vault</span>
                </h4>

                <p>Own what you love.</p>
                <p>
                    The definitive destination for movie and TV <br />
                    collectors. Physical discs and digital copies — new <br />
                    releases, cult classics, and everything in between.
                </p>

                <p>NEW RELEASES & EXCLUSIVE DEALS</p>
                <div>
                    <input type="text" placeholder="example@gmail.com"/>
                    <button>SUBSCRIBE</button>
                </div>
            </section>

            <section>
                <h5>BROWSE</h5>
                <a href="#">New Releases</a>
                <a href="#">Bestsellers</a>
                <a href="#">Movies</a>
                <a href="#">TV Series</a>
                <a href="#">Pre-Orders</a>
                <a href="#">Coming Soon</a>
                <a href="#">Gift Cards</a>
            </section>

            <section>
                <h5>FORMATS</h5>
                <a href="#">4K Ultra HD</a>
                <a href="#">Blu-ray</a>
                <a href="#">DVD</a>
                <a href="#">Digital Download</a>
                <a href="#">Streaming Codes</a>
                <a href="#">Collector's Editions</a>
                <a href="#">Box Sets</a>
            </section>

            <section>
                <h5>SUPPORT</h5>
                <a href="#">My Account</a>
                <a href="#">Track My Order</a>
                <a href="#">Returns & Exchanges</a>
                <a href="#">Digital Redemption</a>
                <a href="#">FAQ</a>
                <a href="#">Contact Us</a>
                <a href="#">Accessibility</a>
            </section>
        </div>

        {/* NEDERST SEKTION */}
        <div>
            <div>
                <span>
                    © 2026 ReelVault, Inc. All rights reserved. Prices and availability subject to change.
                </span>

                <span>
                    <a href="#">Privacy Policy</a>
                    <a href="#">Terms of Use</a>
                    <a href="#">Cookie Settings</a>
                    <a href="#">Accessibility Statement</a>
                    <a href="#">Do Not Sell My Info</a>
                </span>
            </div>
        </div>
    </footer>
  );
}