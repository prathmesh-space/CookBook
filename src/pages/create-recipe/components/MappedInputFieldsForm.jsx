import React from "react";
import "../create-recipe.css";

const MappedInputFieldsForm = ({
  fields,
  formData,
  defaultValues = {},
  onChange,
  className,
  invalidFields,
}) => {
  const inputFormClass = `${className}label-row-container`;
  const fieldRowClass = `${className}field-row`;

  return (
    <div className={inputFormClass}>
      {fields.map((field) => (
        <div className={fieldRowClass} key={field.name}>
          <label htmlFor={field.name}>{field.label}</label>
          {field.type === "select" ? (
            <select
              id={field.name}
              name={field.name}
              value={formData[field.name] || defaultValues[field.name] || ""}
              onChange={onChange}
              className={
                invalidFields && invalidFields.includes(field.name)
                  ? "invalid-input"
                  : ""
              }
            >
              <option value="">{field.placeholder}</option>
              {field.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          ) : field.type === "textarea" ? (
            <textarea
              id={field.name}
              name={field.name}
              placeholder={field.placeholder}
              value={formData[field.name] || defaultValues[field.name] || ""}
              onChange={onChange}
              className={
                invalidFields && invalidFields.includes(field.name)
                  ? "invalid-input"
                  : ""
              }
            />
          ) : (
            <input
              type={field.type}
              id={field.name}
              name={field.name}
              placeholder={field.placeholder}
              value={formData[field.name] || defaultValues[field.name] || ""}
              min={field.min}
              max={field.max}
              onChange={onChange}
              className={
                invalidFields && invalidFields.includes(field.name)
                  ? "invalid-input"
                  : ""
              }
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default MappedInputFieldsForm;
