import React from "react";

const FileInput = ({ changeHandler, Values, width, name, accept }) => {
//   let { photo } = Values;

  return (
    <div
      style={{
        position: "relative",
        width: width ? width : "60%",
        display: "flex",
        alignItems: "center",
        border: "1px solid lightgrey",
        height: "fit-content",
        borderRadius: "5px",
      }}
    >
      <input
        // type="file"
        style={{
          position: "relative",
          zIndex: "2",
          width: "100%",
          height: "calc(1.5em + .75rem + 2px)",
          margin: "0",
          opacity: "0",
          border: "1px dotted black",
        }}
      />
      <span
        style={{
            backgroundColor:'#ededed',
          height: "100%",
          padding: "5px",
          outline: "none",
          border: "none",
        }}
      >
        <div style={{ position: "relative" }}>
          <input
          name={name}
            onChange={changeHandler}
            style={{
              width: "70px",
              position: "relative",
              zIndex: "2",
              height: "calc(1.5em + .75rem + 2px)",
              margin: "0",
              opacity: "0",
              cursor: "pointer",
            }}
            accept={accept ? "image/jpg, image/jpeg, image/png" : 'image/png, image/jpeg, application/pdf'}
            type="file"
          />
          <p
            style={{
              position: "absolute",
              top: "0px",
              right: "7px",
            }}
          >
            Browse
          </p>
        </div>
      </span>
      {/* <label style={{ position: "absolute", left: "10px" }}>
        {Values ? `${Values.name.substring(0, 25)}...` : ""}
      </label> */}
    </div>
  );
};

export default FileInput;
