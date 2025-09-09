import React from "react";
import { ListGroupItem } from "reactstrap";
import { Link } from "react-router-dom";

const EmptyCollectionMessage = ({ collectionName, href }) => {
  return (
    <ListGroupItem>
      <div>No {collectionName}</div>
      {href && (
        <div>
          <Link to={href}>Want to add one?</Link>
        </div>
      )}
    </ListGroupItem>
  );
};

export default EmptyCollectionMessage;
