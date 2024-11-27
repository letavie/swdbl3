import React from "react";
import styled from "styled-components";
import ppht1 from "../../Assets/discordicon1.png";
import ppht2 from "../../Assets/ggmeet1.png";
import ppht3 from "../../Assets/zoom1.png";

const InfoContainer = styled.div`
  max-width: 1100px;
  padding: 16px;
  background-color: white;
  border-radius: 8px;
  margin-top: 16px;
`;

const InfoTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 15px;
`;

const InfoContent = styled.div`
  font-size: 1rem;
  line-height: 1.5;
`;

const ContactContainer = styled.div`
  margin-top: 20px;
`;

const ContactItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`;

const ContactIcon = styled.img`
  width: 24px;
  height: 24px;
  margin-right: 10px;
`;

const ContactLink = styled.a`
  color: #1a73e8;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const getContactIcon = (type) => {
  switch (type) {
    case 'DISCORD':
      return ppht1;
    case 'MEET':
      return ppht2;
    case 'ZOOM':
      return ppht3;
    default:
      return null;
  }
};

const TeacherInfo = ({ information, contacts }) => {
  return (
    <InfoContainer>
      <div>
        <InfoTitle>Introduce</InfoTitle>
        <InfoContent>
          <p className="my-2">{information}</p>
        </InfoContent>
      </div>
      <ContactContainer>
        <InfoTitle>Platform</InfoTitle>
        {contacts.map((contact) => (
          <ContactItem key={contact.id}>
            <ContactIcon src={getContactIcon(contact.type)} alt={contact.type} />
            <ContactLink href={contact.urlContact} target="_blank">
              {contact.urlContact}
            </ContactLink>
          </ContactItem>
        ))}
      </ContactContainer>
    </InfoContainer>
  );
};

export default TeacherInfo;
