import Autocomplete from '@mui/material/Autocomplete';
import * as React from 'react';

import { TextField } from 'src/components/TextField';
import { useInfiniteVolumesQuery } from 'src/queries/volumes';

interface Props {
  disabled?: boolean;
  error?: string;
  onBlur: (e: any) => void;
  onChange: (volumeId: null | number) => void;
  region?: string;
  value: number;
}

const VolumeSelect = (props: Props) => {
  const { disabled, error, onBlur, onChange, region, value } = props;

  const [inputValue, setInputValue] = React.useState<string>('');

  const searchFilter = inputValue
    ? {
        '+or': [
          { label: { '+contains': inputValue } },
          { tags: { '+contains': inputValue } },
        ],
      }
    : {};

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
  } = useInfiniteVolumesQuery({
    ...searchFilter,
    ...(region ? { region } : {}),
    '+order': 'asc',
    // linode_id: null,  <- if the API let us, we would do this
    '+order_by': 'label',
  });

  const options = data?.pages
    .flatMap((page) => page.data)
    .map(({ id, label }) => ({ id, label }));

  const selectedVolume = options?.find((option) => option.id === value) ?? null;

  return (
    <Autocomplete
      ListboxProps={{
        onScroll: (event: React.SyntheticEvent) => {
          const listboxNode = event.currentTarget;
          if (
            listboxNode.scrollTop + listboxNode.clientHeight >=
              listboxNode.scrollHeight &&
            hasNextPage
          ) {
            fetchNextPage();
          }
        },
      }}
      onInputChange={(event, value) => {
        setInputValue(value);
      }}
      renderInput={(params) => (
        <TextField
          helperText={
            region && "Only volumes in this Linode's region are attachable."
          }
          errorText={error}
          label="Volume"
          loading={isLoading}
          onBlur={onBlur}
          placeholder="Select a Volume"
          {...params}
        />
      )}
      disabled={disabled}
      inputValue={inputValue}
      isOptionEqualToValue={(option) => option.id === selectedVolume?.id}
      loading={isLoading}
      onChange={(event, value) => onChange(value?.id ?? -1)}
      options={options ?? []}
      value={selectedVolume}
    />
  );
};

export default VolumeSelect;
