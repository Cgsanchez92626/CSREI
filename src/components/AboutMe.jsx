import React from "react";
import myimg from "../assets/MyPhotoWhite.jpg";
import "./AboutMe.css";

function AboutMe() {
  return (
    <section>
      <div>
        <img className="myimg" src={myimg} height="300px" width="300px" />
        <ul className="contact-info">
          <li>
            <strong>Premier Realty Associates</strong>
          </li>
          <li>
            <strong className="reid">Real Estate Advisor</strong>
          </li>
          <li className="reid">DRE: 02073116</li>
          <br />
          <li>
            <address>Merccury Street, Suite 214</address>
          </li>
          <li>
            <address>San Diego, CA 82111</address>
          </li>
          <li>
            <a href="tel:+19493555899">
              <br />
              <strong>
                <em>949-355-5899</em>
              </strong>
            </a>
          </li>
          <li>
            <a href="mailto:CarmenSanchezREI@gmail.com">
              <strong>
                <em>CarmenSanchezREI@gmail.com</em>
              </strong>
            </a>
          </li>
        </ul>
      </div>
      <div>
        <h2>PROFESSIONAL BACKGROUND</h2>
        <br />
        <p className="MyBio">
          With a passion for investing in real estate for over 25 years, and a
          commitment to listening for what people want from real estate
          investments, Carmen brings these attributes together to best serve her
          clients. She focuses on commercial real estate in the greater Los
          Angeles area. Helping clients realize their real estate aspirations is
          her goal. <br />
          <br />
          As a Data Architect and Software Engineer in the Technology industry
          for many years, she learned the intricacies of dealing with the
          details and presenting these details in various forms depending on the
          audience. These skills of leveraging technology for research,
          communication and problem solving transferred effortlessly to Carmen’s
          desire to help clients achieve their real estate goals. The respect
          and personal attention her clients receive from her results in a trust
          that Carmen will always be there to assist clients to achieve their
          real estate desires. <br />
          <br />
          In addition to her affinity for real estate, Carmen also enjoys
          hiking, acting/theater and spending time with friends and family. At
          any given time, you will experience Carmen engaged in the details of
          technology and investing in various markets both financial and real
          estate. As a whole, when it comes to a successful real estate
          experience, Carmen Sanchez acknowledges the specific needs of the
          individual client and is thrilled to take that journey together.
        </p>
      </div>
    </section>
  );
}

export default AboutMe;
