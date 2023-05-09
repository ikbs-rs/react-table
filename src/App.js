import React, { useState, useEffect, useRef } from "react";
import { classNames } from "primereact/utils";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ProductService } from "./service/ProductService";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Button } from "primereact/button";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { TriStateCheckbox } from "primereact/tristatecheckbox";
import { Calendar } from "primereact/calendar";
import { Toast } from "primereact/toast";

export default function RemovableSortDemo() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [filters, setFilters] = useState(null);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useRef(null);

  useEffect(() => {
    ProductService.getProductsMini().then((data) => {
      setProducts(getProducts(data));
      setLoading(false);
    });
    initFilters();
  }, []);

  const getProducts = (data) => {
    return [...(data || [])].map((d) => {
      d.date = new Date(d.date);

      return d;
    });
  };

  const formatDate = (value) => {
    return [value];
    //     \.toLocaleDateString('en-US', {
    //   day: '2-digit',
    //   month: '2-digit',
    //   year: 'numeric',
    // });
  };

  const formatCurrency = (value) => {
    return value.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
  };

  const onRowSelect = (event) => {
    toast.current.show({
      severity: "info",
      summary: "Product Selected",
      detail: `Id: ${event.data.id} Name: ${event.data.name}`,
      life: 3000,
    });
  };

  const onRowUnselect = (event) => {
    toast.current.show({
      severity: "warn",
      summary: "Product Unselected",
      detail: `Id: ${event.data.id} Name: ${event.data.name}`,
      life: 3000,
    });
  };
  // <heder za filter
  const initFilters = () => {
    setFilters({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      code: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
      name: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
      category: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
      quantity: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
      },
      begda: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }],
      },
      verified: { value: null, matchMode: FilterMatchMode.EQUALS },
    });
    setGlobalFilterValue("");
  };

  const clearFilter = () => {
    initFilters();
  };

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };

    _filters["global"].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const quantityFilterTemplate = (options) => {
    return (
      <InputNumber
        value={options.value}
        onChange={(e) => options.filterCallback(e.value, options.index)}
      />
    );
  };

  const renderHeader = () => {
    return (
      <div class="flex card-container">
        <div class="flex flex-wrap gap-1">
            <Button label="New" icon="pi pi-plus" severity="success" text raised />
            <Button label="Code" icon="pi pi-upload" text raised />
            <Button
              type="button"
              icon="pi pi-filter-slash"
              label="Clear"
              outlined
              onClick={clearFilter}
              text raised
            />
        </div>
        <div class="flex-grow-1" />
        <div class="flex flex-wrap gap-1">
          <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            value={globalFilterValue}
            onChange={onGlobalFilterChange}
            placeholder="Keyword Search"
          />
        </span>
          <Button
            type="button"
            icon="pi pi-filter-slash"
            label="Clear"
            outlined
            onClick={clearFilter}
            text raised
          />
        </div>
      </div>
    );
  };

  const verifiedBodyTemplate = (rowData) => {
    return (
      <i
        className={classNames("pi", {
          "text-green-500 pi-check-circle": rowData.verified,
          "text-red-500 pi-times-circle": !rowData.verified,
        })}
      ></i>
    );
  };

  const verifiedFilterTemplate = (options) => {
    return (
      <div className="flex align-items-center gap-2">
        <label htmlFor="verified-filter" className="font-bold">
          Verified
        </label>
        <TriStateCheckbox
          inputId="verified-filter"
          value={options.value}
          onChange={(e) => options.filterCallback(e.value)}
        />
      </div>
    );
  };

  const begdaBodyTemplate = (rowData) => {
    return formatDate(rowData.date);
  };

  const dateFilterTemplate = (options) => {
    return (
      <Calendar
        value={options.value}
        onChange={(e) => options.filterCallback(e.value, options.index)}
        dateFormat="dd.mm.yyyy"
        placeholder="dd.mm.yyyy"
        mask="99.99.9999"
      />
    );
  };

  const header = renderHeader();
  // heder za filter/>

  const actionTemplate = () => {
    return (
        <div className="flex flex-wrap gap-1">
            <Button type="button" icon="pi pi-times" severity="danger"  style={{ width: '24px', height: '24px' }} text raised ></Button>
            <Button type="button" icon="pi pi-pencil"   style={{ width: '24px', height: '24px' }} text raised ></Button>
        </div>
    );
};

  return (
    <div className="card">
      <Toast ref={toast} />
      <DataTable
        dataKey="id"
        selectionMode="single"
        selection={selectedProduct}
        loading={loading}
        value={products}
        header={header}
        showGridlines
        removableSort
        filters={filters}
        scrollable
        scrollHeight="600px"
        virtualScrollerOptions={{ itemSize: 46 }}
        tableStyle={{ minWidth: "50rem" }}
        metaKeySelection={false}
        paginator
        rows={10}
        rowsPerPageOptions={[5, 10, 25, 50]}
        onSelectionChange={(e) => setSelectedProduct(e.value)}
        onRowSelect={onRowSelect}
        onRowUnselect={onRowUnselect}
      >
        <Column
          field="code"
          header="Code"
          sortable
          filter
          style={{ width: "25%" }}
        ></Column>
        <Column
          field="name"
          header="Name"
          sortable
          filter
          style={{ width: "25%" }}
        ></Column>
        <Column
          field="category"
          header="Category"
          sortable
          filter
          style={{ width: "25%" }}
        ></Column>
        <Column
          field="quantity"
          filterField="quantity"
          dataType="numeric"
          header="Quantity"
          sortable
          filter
          filterElement={quantityFilterTemplate}
          style={{ width: "15%" }}
        ></Column>
        <Column
          field="begda"
          header="Date"
          sortable
          filter
          filterElement={dateFilterTemplate}
          //body={begdaBodyTemplate}
          style={{ width: "10%" }}
        ></Column>
        <Column
          field="verified"
          filterField="verified"
          dataType="boolean"
          header="Verified"
          sortable
          filter
          filterElement={verifiedFilterTemplate}
          style={{ width: "10%" }}
          bodyClassName="text-center"
          body={verifiedBodyTemplate}
        ></Column>
        <Column 
          bodyClassName="text-center"
          body={actionTemplate} 
          headerClassName="w-10rem" 
          style={{ minWidth: '7rem' }} 
        />
      </DataTable>
    </div>
  );
}
