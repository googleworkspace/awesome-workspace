/**
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import Image from 'next/image';
import { API } from '../shared/types';

const PRODUCT_ICONS: { [key: string]: string } = {
  admin: "https://fonts.gstatic.com/s/i/productlogos/admin_2020q4/v6/192px.svg",
  apps_script:
    "https://fonts.gstatic.com/s/i/productlogos/apps_script/v10/192px.svg",
  calendar:
    "https://fonts.gstatic.com/s/i/productlogos/calendar_2020q4/v13/192px.svg",
  chat: "https://fonts.gstatic.com/s/i/productlogos/chat_2020q4/v8/192px.svg",
  classroom:
    "https://fonts.gstatic.com/s/i/productlogos/classroom/v7/192px.svg",
  cloud_identity:
    "https://fonts.gstatic.com/s/i/productlogos/cloud_identity/v6/192px.svg",
  cloud_search:
    "https://fonts.gstatic.com/s/i/productlogos/google_cloud_search/v7/192px.svg",
  contacts: "https://fonts.gstatic.com/s/i/productlogos/contacts/v9/192px.svg",
  docs: "https://fonts.gstatic.com/s/i/productlogos/docs_2020q4/v12/192px.svg",
  drive:
    "https://fonts.gstatic.com/s/i/productlogos/drive_2020q4/v10/192px.svg",
  forms: "https://fonts.gstatic.com/s/i/productlogos/forms_2020q4/v6/192px.svg",
  gmail:
    "https://fonts.gstatic.com/s/i/productlogos/gmail_2020q4/v11/192px.svg",
  groups: "https://fonts.gstatic.com/s/i/productlogos/groups/v9/192px.svg",
  keep: "https://fonts.gstatic.com/s/i/productlogos/keep_2020q4/v8/192px.svg",
  marketplace:
    "https://fonts.gstatic.com/s/i/productlogos/gsuite_marketplace/v6/192px.svg",
  sheets:
    "https://fonts.gstatic.com/s/i/productlogos/sheets_2020q4/v11/192px.svg",
  slides:
    "https://fonts.gstatic.com/s/i/productlogos/slides_2020q4/v12/192px.svg",
  tasks: "https://fonts.gstatic.com/s/i/productlogos/tasks/v10/192px.svg",
  vault: "https://fonts.gstatic.com/s/i/productlogos/vault/v6/192px.svg",
};

const ProductIcon = ({ name }: { name: API }) => {
  return (
    <Image
      src={PRODUCT_ICONS[API[name]]}
      alt={name}
      height={24}
      width={24}
    />
  );
};

export default ProductIcon;
