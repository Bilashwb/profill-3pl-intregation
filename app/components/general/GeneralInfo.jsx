import {LegacyCard, Tabs} from '@shopify/polaris';
import {useState, useCallback} from 'react';
import Instruction from './Instruction';
import Information from './Information';



export default function() {
  const [selected, setSelected] = useState(0);

  const handleTabChange = useCallback(
    (selectedTabIndex) => setSelected(selectedTabIndex),
    [],
  );

  const tabs = [
    {
      id: 'information',
      content: 'Information',
      accessibilityLabel: 'Information',
      panelID: 'information',
      panelBody:<Information/>
    },
    {
      id: 'instruction',
      content: 'Instruction',
      panelID: 'instruction',
      panelBody:<Instruction/>
    },
  ];

  return (
    <Tabs tabs={tabs} selected={selected} onSelect={handleTabChange}>
      <LegacyCard.Section >
       {tabs[selected].panelBody}
      </LegacyCard.Section>
    </Tabs>
  );
}